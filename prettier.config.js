module.exports = {
  overrides: [
    {
      files: "*.sol",
      options: {
        printWidth: 170,
        plugins: [require.resolve('prettier-plugin-solidity')]
      }
    }
  ]
};