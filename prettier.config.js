module.exports = {
  overrides: [
    {
      files: "*.sol",
      options: {
        printWidth: 140,
        plugins: [require.resolve('prettier-plugin-solidity')]
      }
    }
  ]
};