/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/App.tsx", "./src/routes/Page404/Page404.tsx", "./src/routes/MainPage/MainPage.tsx", 
  "./src/routes/Footer/Footer.tsx", "./src/routes/Page403/Page403.tsx", "./src/routes/Header/Header.tsx", "./src/routes/LoginPage/LoginPage.tsx",
"./src/routes/RegistartionPage/RegistrationPage.tsx"],
  theme: {
    extend: {
      backgroundImage:{
        'git': "url('../public/materials/images/git.svg')",
        'main':"url('../public/materials/images/background.jpg')",
        'anon':"url('../public/materials/images/anon.png')",
        'cross':"url('../public/materials/images/cross.svg')"
      },
      backgroundColor:{
        'fix':"rgba(0,0,0,0.4)",
      }
    }
  },
  plugins: [],
}

