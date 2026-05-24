from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):

    def has_permission(self, request, view):

        return request.user.userprofile.role == 'admin'


class IsOperatorUserRole(BasePermission):

    def has_permission(self, request, view):

        return request.user.userprofile.role == 'operator'