/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/App.tsx", "./src/routes/Page404/Page404.tsx", "./src/routes/MainPage/MainPage.tsx","./src/routes/MainPage/MainPageLoading.tsx", 
  "./src/routes/Footer/Footer.tsx", "./src/routes/Page403/Page403.tsx", "./src/routes/Header/Header.tsx", "./src/routes/LoginPage/LoginPage.tsx",
"./src/routes/RegistartionPage/RegistrationPage.tsx", "./src/routes/MainPage/MainPageConnected.tsx", "./src/routes/Header/HeaderLogin.tsx", "./src/routes/LoginPage/LoginAsk.tsx", "./src/routes/LoginPage/LoginSuccess.tsx",
"./src/routes/UserRecordings/UserRecordings.tsx"],
  theme: {
    extend: {
      backgroundImage:{
        'git': "url('../public/materials/images/git.svg')", 
        'main':"url('../public/materials/images/background.jpg')",
        'anon':"url('../public/materials/images/anon.png')",
        'cross':"url('../public/materials/images/cross.svg')",
        'avatar':"url('../public/materials/images/avatar.png')",
        'loading':"url('../public/materials/images/loading.png')"
      },
      backgroundColor:{
        'fix':"rgba(0,0,0,0.4)",
      }
    }
  },
  plugins: [],
}

