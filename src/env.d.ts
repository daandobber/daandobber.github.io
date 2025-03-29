declare module "@pagefind/default-ui" {
	declare class PagefindUI {
		constructor(arg: unknown);
	}
}
declare module '*.astro' {
	export interface AstroComponentFactoryProps {}
	const Component: Astro.ComponentFactory<AstroComponentFactoryProps>;
	export default Component;
}
