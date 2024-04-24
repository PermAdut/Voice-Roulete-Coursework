import React, { FC } from "react";

const UsersOnline: FC = () => {
  return (
    <>
      <section className="flex flex-wrap flex-col text-white content-center">
        <div className="flex flex-wrap flex-col content-center">
          <h2 className="text-4xl text-center">Пользователи онлайн</h2>
          <div>
            <h4>UID: *userID*</h4>
            <h3>Пользователь: *nickName*</h3>
            <p>Подключен с адреса *NAT*</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default UsersOnline;
