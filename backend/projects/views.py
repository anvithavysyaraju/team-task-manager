from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, Task, TaskStatus
from .permissions import ProjectPermission, TaskPermission
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    TaskStatusUpdateSerializer,
)

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated, ProjectPermission)

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.select_related('created_by').prefetch_related('members')
        if user.is_admin:
            return qs
        return qs.filter(members=user).distinct()


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, TaskPermission)

    def get_queryset(self):
        user = self.request.user
        qs = Task.objects.select_related(
            'project', 'assigned_to', 'created_by'
        )
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)

        if user.is_admin:
            return qs

        return qs.filter(
            Q(project__members=user) | Q(assigned_to=user)
        ).distinct()

    def get_serializer_class(self):
        if (
            not self.request.user.is_admin
            and self.action == 'partial_update'
        ):
            return TaskStatusUpdateSerializer
        return TaskSerializer

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_admin:
            allowed = {'status'}
            if set(request.data.keys()) - allowed:
                return Response(
                    {'detail': 'Members may only update task status.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
        return super().partial_update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        if not request.user.is_admin:
            return Response(
                {'detail': 'Only admins can create tasks.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_admin:
            return Response(
                {'detail': 'Only admins can update tasks.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_admin:
            return Response(
                {'detail': 'Only admins can delete tasks.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


class DashboardView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user

        if user.is_admin:
            projects = Project.objects.all()
            tasks = Task.objects.all()
        else:
            projects = Project.objects.filter(members=user)
            tasks = Task.objects.filter(
                Q(project__members=user) | Q(assigned_to=user)
            ).distinct()

        tasks_by_status = dict(
            tasks.values('status')
            .annotate(count=Count('id'))
            .values_list('status', 'count')
        )
        for status_value, _ in TaskStatus.choices:
            tasks_by_status.setdefault(status_value, 0)

        my_tasks = tasks.filter(assigned_to=user) if not user.is_admin else tasks
        recent_tasks = TaskSerializer(
            tasks.order_by('-updated_at')[:5],
            many=True,
            context={'request': request},
        ).data

        return Response({
            'role': user.role,
            'project_count': projects.count(),
            'task_count': tasks.count(),
            'tasks_by_status': tasks_by_status,
            'my_assigned_task_count': my_tasks.count(),
            'recent_tasks': recent_tasks,
        })
