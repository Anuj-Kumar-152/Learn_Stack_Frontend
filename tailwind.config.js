import typography from '@tailwindcss/typography'
 

export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
      extend: {
         fontFamily: {
            merriweather: ["Merriweather", "serif"],
         },
      },
   },
   plugins: [require('@tailwindcss/typography')],
}


// /** @type {import('tailwindcss').Config} */
// export default {
//    content: [
//       "./index.html",
//       "./src/**/*.{js,ts,jsx,tsx}",
//    ],
//    plugins: [],
// }
