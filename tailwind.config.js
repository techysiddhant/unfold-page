/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs","./views/partials/**/*.ejs"],
  theme: {
    extend: {

    },
    fontFamily:{
      dance:['Dancing Script', 'cursive'],
      pacifico: ['Pacifico', 'cursive']
    },
  },
  plugins: [],
}
