from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from . import views

# Tạo Router - Nó tự động sinh ra các đường dẫn list, detail, create, update, delete
router = DefaultRouter()
router.register(r'roles', RoleViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'employees', EmployeeViewSet) # Gọi /api/employees/
router.register(r'patients', PatientViewSet)   # Gọi /api/patients/
router.register(r'appointments', AppointmentViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'drugs', DrugViewSet)

urlpatterns = [
    # Đường dẫn đăng nhập riêng
    path('login/', LoginView.as_view(), name='login'),
    path('available-slots/', views.get_available_slots, name='available-slots'),
    # Nhúng toàn bộ đường dẫn do router tạo ra
    path('', include(router.urls)),
]