// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './PatientManage.module.css';
const API_URL = 'http://localhost:8000/api/patients/'

export default function PatientManage() {
    // const [patients, setPatients] = useState([])
    // const [name, setName] = useState('')
    // const [age, setAge] = useState('')
    // const [diagnosis, setDiagnosis] = useState('')
    // const [editingId, setEditingId] = useState(null)

    // useEffect(() => {
    //     fetchPatients()
    // }, [])

    // const fetchPatients = () => {
    //     axios.get(API_URL).then(res => setPatients(res.data))
    // }

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     const patient = { name, age, diagnosis }

    //     if (editingId) {
    //     axios.put(`${API_URL}${editingId}/`, patient).then(() => {
    //         resetForm()
    //         fetchPatients()
    //     })
    //     } else {
    //     axios.post(API_URL, patient).then(() => {
    //         resetForm()
    //         fetchPatients()
    //     })
    //     }
    // }

    // const handleEdit = (patient) => {
    //     setName(patient.name)
    //     setAge(patient.age)
    //     setDiagnosis(patient.diagnosis)
    //     setEditingId(patient.id)
    // }

    // const handleDelete = (id) => {
    //     axios.delete(`${API_URL}${id}/`).then(fetchPatients)
    // }

    // const resetForm = () => {
    //     setName('')
    //     setAge('')
    //     setDiagnosis('')
    //     setEditingId(null)
    // }
    // return (
    //     <div className={styles["patient-manage"]}>
    //         <h2>Quản lý bệnh nhân</h2>

    //         <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
    //         <input placeholder="Tên" value={name} onChange={e => setName(e.target.value)} required />
    //         <input placeholder="Tuổi" type="number" value={age} onChange={e => setAge(e.target.value)} required />
    //         <input placeholder="Chuẩn đoán" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required />
    //         <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
    //         {editingId && <button onClick={resetForm}>Hủy</button>}
    //         </form>

    //         <ul>
    //         {patients.map(p => (
    //             <li key={p.id}>
    //             {p.name} ({p.age}) - {p.diagnosis}
    //             <button onClick={() => handleEdit(p)}>Sửa</button>
    //             <button onClick={() => handleDelete(p.id)}>Xóa</button>
    //             </li>
    //         ))}
    //         </ul>
    //     </div>
    // )
}