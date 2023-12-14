export class CpfValidator {
  static validate(cpf: string) {
    if (!cpf) return false;
    cpf = this.cleanValue(cpf);
    if (!this.isValidLength(cpf)) return false;
    if (this.allDigitsTheSame(cpf)) return false;
    const dg1 = this.calculateDigit(cpf, 10);
    const dg2 = this.calculateDigit(cpf, 11);
    const checkDigit = this.extractDigit(cpf);
    const calculatedDigit = `${dg1}${dg2}`;

    return checkDigit === calculatedDigit;
  }

  private static cleanValue(cpf: string) {
    return cpf.replace(/\D/g, '');
  }

  private static isValidLength(cpf: string) {
    return cpf.length === 11;
  }

  private static allDigitsTheSame(cpf: string) {
    return cpf.split('').every((c) => c === cpf[0]);
  }

  private static calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const char of cpf) {
      if (factor >= 2) total += parseInt(char) * factor--;
    }
    const rest = total % 11;

    return rest < 2 ? 0 : 11 - rest;
  }

  private static extractDigit(cpf: string) {
    return cpf.substring(cpf.length - 2, cpf.length);
  }
}
