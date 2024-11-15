// Função de geração de senha com validação de comprimento
export const generateRandomPassword = (length = 12) => {
  const minLength = 8;
  const maxLength = 32;

  // Validação do comprimento da senha
  if (length < minLength) {
    length = minLength; // Se o comprimento for menor que 8, define como 8
  } else if (length > maxLength) {
    length = maxLength; // Se o comprimento for maior que 32, define como 32
  }

  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-+_{}[]";
  let password = "";

  // Gerando a senha aleatória
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};


export const validateUrl = (url) => {
  // Regex que aceita URLs com ou sem http:// ou https://
  const regex = /^(?!https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
  return regex.test(url);
};


  