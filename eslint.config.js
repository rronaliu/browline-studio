import tseslint from 'typescript-eslint';
export default tseslint.config({ignores:['public/**','test-results/**','dist/**','node_modules/**']},...tseslint.configs.recommended);
