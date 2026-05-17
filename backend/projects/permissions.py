from rest_framework.permissions import BasePermission, SAFE_METHODS


class ProjectPermission(BasePermission):
    """
    Admin: full CRUD on all projects.
    Member: list/retrieve projects they belong to.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_admin

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        if request.method in SAFE_METHODS:
            return obj.members.filter(pk=request.user.pk).exists()
        return False


class TaskPermission(BasePermission):
    """
    Admin: full CRUD.
    Member: list/retrieve tasks in their projects; PATCH status on assigned tasks only.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_admin:
            return True
        if request.method in SAFE_METHODS:
            return True
        if request.method == 'PATCH' and view.action == 'partial_update':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True

        is_project_member = obj.project.members.filter(pk=request.user.pk).exists()

        if request.method in SAFE_METHODS:
            return is_project_member

        if request.method == 'PATCH' and view.action == 'partial_update':
            return obj.assigned_to_id == request.user.pk

        return False
