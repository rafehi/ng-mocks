import { NgModule, Type } from '@angular/core';
import { MockComponent } from 'mock-component';
import { MockDirective } from 'mock-directive';
import { MockPipe } from 'mock-pipe';

const mockLookup: { [key: string]: any } = {
  Component: MockComponent,
  Directive: MockDirective,
  Pipe: MockPipe
};

const mockDeclaration = (declaration: any) => {
  const type = declaration.__annotations__[0].__proto__.ngMetadataName;
  return mockLookup[type](declaration);
};

const mockProvider = (provider: any) => ({
  provide: provider, useValue: {}
});

class MockedModule {}

export function MockModule<TModule>(module: Type<TModule>): any {
  return NgModule(MockIt(module))(MockedModule);
}

function MockIt(module: any): any {
  const mockedModule = { declarations: [] as any[],
                         exports: [] as any[],
                         providers: [] as any[] };
  const declarations = (module as any).__annotations__[0].declarations || [];
  const exports = (module as any).__annotations__[0].exports || [];
  const imports = (module as any).__annotations__[0].imports || [];
  const providers = (module as any).__annotations__[0].providers || [];
  mockedModule.declarations = [...declarations.map(mockDeclaration)];
  mockedModule.exports = exports;
  mockedModule.providers = providers.map(mockProvider);
  imports.reduce((acc: any, im: any) => {
    const result = MockIt(im);
    acc.declarations.push(...result.declarations);
    acc.providers.push(...result.providers);
    acc.exports.push(...result.declarations);
  }, mockedModule);
  return mockedModule;
}
