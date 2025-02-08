import axios from 'axios'

// Membuat instance Axios dengan konfigurasi dasar
const axiosInstance = axios.create({
  baseURL: 'https://api.myquran.com/v2', // Ganti dengan URL dasar API Anda
  timeout: 10000, // Waktu tunggu dalam milidetik
  headers: {
    'Content-Type': 'application/json', // Jenis konten yang dikirim
    // Tambahkan header lain jika diperlukan
  },
})

// Menangani respons global
axiosInstance.interceptors.response.use(
  (response) => {
    // Mengembalikan respons jika berhasil
    return response
  },
  (error) => {
    // Menangani kesalahan
    return Promise.reject(error)
  },
)

// Menangani permintaan global jika diperlukan
axiosInstance.interceptors.request.use(
  (config) => {
    // Tidak menambahkan token otentikasi karena tidak diperlukan
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance
