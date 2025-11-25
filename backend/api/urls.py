from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Tạo một Router để tự động quản lý URL cho các ViewSet
router = DefaultRouter()

# 1. Cấu trúc, Danh mục & Phân quyền
router.register('users', views.UserViewSet, basename='user')
router.register('roles', views.RoleViewSet, basename='role')
router.register('departments', views.DepartmentViewSet, basename='department')
router.register('hospitals', views.HospitalViewSet, basename='hospital')
router.register('employee-types', views.EmployeeTypeViewSet, basename='employee-type')
router.register('health-condition-types', views.HealthConditionTypeViewSet, basename='health-condition-type')

# 2. Actor và Hồ sơ
router.register('patients', views.PatientViewSet, basename='patient')
router.register('employees', views.EmployeeViewSet, basename='employee')
router.register('medical-records', views.MedicalRecordViewSet, basename='medical-record')
router.register('basic-healthcares', views.BasicHealthcareViewSet, basename='basic-healthcare')

# 3. Quy trình khám
router.register('appointments', views.AppointmentViewSet, basename='appointment')
router.register('medical-visits', views.MedicalVisitViewSet, basename='medical-visit') # Bao gồm custom action: /medical-visits/by_patient/

# 4. Thuốc, Dịch vụ và Kết quả
router.register('drugs', views.DrugViewSet, basename='drug')
router.register('services', views.ServiceViewSet, basename='service')
router.register('prescriptions', views.PrescriptionViewSet, basename='prescription')
router.register('results', views.ResultViewSet, basename='result')
router.register('result-types', views.ResultTypeViewSet, basename='result-type')

# 5. Tài chính và Hệ thống
router.register('invoices', views.InvoiceViewSet, basename='invoice') # Bao gồm custom action: /invoices/{pk}/details/
router.register('invoice-details', views.InvoiceDetailViewSet, basename='invoice-detail')
router.register('activity-logs', views.ActivityLogViewSet, basename='activity-log')


# Định nghĩa URL chính
urlpatterns = [
    # Đưa tất cả URL đã đăng ký của Router vào đây
    path('', include(router.urls)),
    
    # (Tùy chọn: Thêm URL cho Authentication như login/logout nếu bạn chưa dùng Djoser)
    # path('auth/', include('djoser.urls')),
    # path('auth/', include('djoser.urls.authtoken')),
]