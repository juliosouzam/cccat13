export class Registry {
  private dependencies: { [name: string]: any };
  private static instance: Registry;

  private constructor() {
    this.dependencies = {};
  }

  provide(name: string, dependecy: Object) {
    this.dependencies[name] = dependecy;
  }

  inject(name: string) {
    return this.dependencies[name];
  }

  static getInstance() {
    if (!this.instance) {
      Registry.instance = new Registry();
    }

    return Registry.instance;
  }
}
