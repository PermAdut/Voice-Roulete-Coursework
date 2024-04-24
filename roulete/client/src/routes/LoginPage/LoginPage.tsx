import { FC } from "react"
import { RegistrationProps } from "../RegistartionPage/Registartion"

const LoginPage:FC<RegistrationProps> = ({
    isActive,
    setActive,
}) => {

    return (
      <>
          <section className='w-full flex h-full flex-col items-center content-center pt-10 text-4xl mx-[500px] bg-cyan-500'>
              <div className='mb-10'>
                  <h2>Авторизация</h2>
              </div>
              <div className='flex flex-col items-center content-center gap-8'>
                  <input placeholder='Логин' />
                  <input  placeholder='Пароль'/>
                  <button className='rounded-3xl text-3xl w-[250px] h-[40px] uppercase text-white bg-green-300 hover:transition-all hover:opacity-80'>войти</button>
              </div>
              <div className="text-xs">Нет аккаунта? <a onClick={setActive} className="cursor-pointer hover:transition-all hover:opacity-80">Регистрация</a></div>
          </section>
      </>
    )
  }


export default LoginPage  