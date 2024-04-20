import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Page403() {

  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate(-1)
    },3000)
  },[])

  return (
    <div>
        <h1 className='text-4xl text-center mt-5 mb-4'>Ошибка 403</h1>
        <h3 className='text-2l text-center'>Не найдено</h3>
        <p className='underline text-3xl text-center'>Данной страницы не существует</p>
    </div>
  )
}
