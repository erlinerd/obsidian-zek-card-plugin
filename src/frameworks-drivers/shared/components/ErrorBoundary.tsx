import React from "react";

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: any) {
        return { hasError: true };
    }
    componentDidCatch(_: any) {}
    render() {
        if (this.state.hasError) {
            return <div className="p-4 text-red-600">组件渲染异常</div>;
        }
        return this.props.children as any;
    }
}
