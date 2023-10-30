import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/bin/release-it-changelogen.ts'],
  splitting: false,
  clean: true,
  format: 'esm',
  dts: true,
})
