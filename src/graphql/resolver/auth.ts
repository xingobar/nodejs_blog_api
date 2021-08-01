import AuthValidator from "validator/auth.validator";

export default {
  signUp: (_: any, { input }: any, context: any) => {
    const { email, account, password, confirmPassword } = input;

    const v = new AuthValidator(input);
    v.register().validate();

    if (v.isError()) {
      return {
        user: null,
        error: {
          code: 400,
          message: v?.detail[0].message,
          field: v?.detail[0].field,
        },
      };
    }

    console.log(email, account, password, confirmPassword);
  },
};
