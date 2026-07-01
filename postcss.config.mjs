const config = {
  plugins: {
    "@tailwindcss/postcss": {
      plugins: [
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('daisyui')
      ]
    },
  },
};

export default config;
