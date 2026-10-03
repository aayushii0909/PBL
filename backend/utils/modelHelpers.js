const addIdVirtual = (schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      if (ret.password) delete ret.password;
      return ret;
    },
  });
};

module.exports = { addIdVirtual };
