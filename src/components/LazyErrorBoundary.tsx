import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

/**
 * Catches errors from failed lazy-loaded chunks and shows a
 * friendly recovery screen instead of a blank page.
 */
export class LazyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isChunk =
      /loading chunk|failed to fetch dynamically imported module/i.test(
        error.message,
      );
    return { hasError: true, isChunkError: isChunk };
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ minHeight: "calc(100vh - 64px)" }}
        dir="rtl"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg max-w-md w-full">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            {/* simple refresh icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-2">
            {this.state.isChunkError
              ? "تعذّر تحميل الصفحة"
              : "حدث خطأ غير متوقع"}
          </h2>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {this.state.isChunkError
              ? "يُرجى إعادة تحميل الصفحة. قد يكون السبب تحديث جديد أو انقطاع مؤقت في الاتصال."
              : "نعتذر عن هذا الخطأ. يُرجى إعادة المحاولة."}
          </p>

          <button
            onClick={this.handleReload}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }
}
