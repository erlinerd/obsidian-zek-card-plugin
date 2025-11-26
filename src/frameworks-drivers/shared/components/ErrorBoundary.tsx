import React, { type ErrorInfo } from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(): State {
        return { hasError: true };
    }
    componentDidCatch(error: unknown, info: ErrorInfo): void {
        console.error(error, info);
    }
    render() {
        if (this.state.hasError) {
            return <div className="p-4 text-red-600">组件渲染异常</div>;
        }
        return this.props.children;
    }
}
