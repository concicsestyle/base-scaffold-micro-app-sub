const icons: string[] = [];
const modules = import.meta.glob(['./../../assets/icons/**/*.svg']);
for (const path in modules) {
  let p: any = path.split('assets/icons')[1].split('.svg')[0];
  // 所有svg资源避免重名
  p = p.split('/');
  p = p[p.length - 1];
  icons.push(p);
}
export default icons;
