from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Project, Task, TaskStatus

User = get_user_model()


class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserBriefSerializer(read_only=True)
    members = UserBriefSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source='members',
    )
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'created_by',
            'members',
            'member_ids',
            'task_count',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def get_task_count(self, obj):
        return obj.tasks.count()

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    assigned_to_detail = UserBriefSerializer(source='assigned_to', read_only=True)
    created_by = UserBriefSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='assigned_to',
        write_only=True,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Task
        fields = (
            'id',
            'project',
            'project_name',
            'title',
            'description',
            'status',
            'priority',
            'assigned_to_detail',
            'assigned_to_id',
            'created_by',
            'due_date',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    """Members may only update task status on tasks assigned to them."""

    class Meta:
        model = Task
        fields = ('status',)

    def validate_status(self, value):
        if value not in TaskStatus.values:
            raise serializers.ValidationError('Invalid status.')
        return value
