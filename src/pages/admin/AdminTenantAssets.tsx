import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleHelp, Clock3, FileImage, FolderTree, Sparkles, Upload, XCircle } from "lucide-react";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportStructureExamples, logoMatchingMatrixRows, missingLogoRows, tenantAssetStats, tenantMasterRows, type LogoStatus, workflowSummary } from "@/lib/tenantAssetData";
import { cn } from "@/lib/utils";

const statusConfig: Record<LogoStatus, { className: string; icon: typeof CheckCircle2; helper: string }> = {
  Confirmed: {
    className: "border-success/20 bg-success/10 text-success",
    icon: CheckCircle2,
    helper: "Ready to move into final export placement.",
  },
  "Needs Cleanup": {
    className: "border-primary/15 bg-primary/10 text-primary",
    icon: Sparkles,
    helper: "Source exists, but it still needs isolation, crop, and transparent export.",
  },
  "Needs Better Source": {
    className: "border-accent/20 bg-accent/10 text-accent",
    icon: Upload,
    helper: "A reference exists, but a cleaner input source is required before production export.",
  },
  Missing: {
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    icon: XCircle,
    helper: "No logo source is currently available.",
  },
  "Pending Confirmation": {
    className: "border-orange/20 bg-orange/10 text-orange",
    icon: Clock3,
    helper: "Source exists, but the unit-to-brand mapping still needs a quick confirmation.",
  },
};

const floorLabels = {
  Ground: "Ground",
  First: "First",
  Second: "Second",
} as const;

function StatusBadge({ status }: { status: LogoStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1.5 rounded-full px-3 py-1 text-[0.76rem] font-semibold", config.className)}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  );
}

function LogoPlaceholder({ title, status }: { title: string; status: LogoStatus }) {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-[1.15rem] border border-dashed border-border bg-muted/60 p-4 text-center">
      <div className="space-y-2">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <FileImage className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{status === "Missing" ? "Missing Logo" : "Source under review"}</p>
        </div>
      </div>
    </div>
  );
}

const AdminTenantAssets = () => {
  const { loading } = useRequireAdmin();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading tenant assets...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex min-h-16 items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary transition-colors hover:text-foreground" aria-label="Back to admin dashboard">
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tenant Logo Workspace</h1>
              <p className="text-sm text-muted-foreground">Master list, matching matrix, missing logos, review status, and final export planning.</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline" size="sm" asChild>
              <a href="#matching-matrix">Logo Matching Matrix</a>
            </Button>
            <Button variant="cta" size="sm" asChild>
              <a href="#missing-logos">Missing Logos</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container space-y-8 py-8 md:space-y-10 md:py-10">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Occupied Units", value: tenantAssetStats.totalUnits, note: "Exact tenant list locked by unit." },
            { label: "Unique Brands", value: tenantAssetStats.totalBrands, note: "One matrix row per tenant brand." },
            { label: "Matched Sources", value: tenantAssetStats.confirmedSourceMatches, note: "Sources available for cleanup or confirmation." },
            { label: "Missing Logos", value: tenantAssetStats.missingBrands, note: "Brands still waiting for a usable source file." },
          ].map((item) => (
            <Card key={item.label} className="rounded-[1.5rem] border-border/90 shadow-[var(--shadow-soft)]">
              <CardHeader className="space-y-2 pb-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</CardDescription>
                <CardTitle className="text-4xl font-bold text-foreground">{item.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-6 text-muted-foreground">{item.note}</CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Asset Review Workflow</CardDescription>
              <CardTitle className="text-2xl text-foreground">Simple production flow for every occupied unit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid gap-3 lg:grid-cols-2">
                {workflowSummary.map((item) => {
                  const config = statusConfig[item.status];
                  const Icon = config.icon;

                  return (
                    <div key={item.status} className="rounded-[1.35rem] border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border", config.className)}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{item.status}</p>
                              <p className="text-xs text-muted-foreground">{item.count} brands</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">{config.helper}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.brands.length > 0 ? item.brands.map((brand) => (
                          <span key={brand} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                            {brand}
                          </span>
                        )) : (
                          <span className="text-sm text-muted-foreground">No brands in this stage.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[1.35rem] border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Operational rules</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>1. Keep the tenant list locked to Ground, First, and Second with exact unit IDs.</li>
                  <li>2. Only clean existing sources: remove background, crop safely, center on a square, export transparent PNG.</li>
                  <li>3. Never redraw, recolor, or invent missing logos — unresolved brands stay flagged as Missing.</li>
                  <li>4. Repeated brands reuse one cleaned master source, then export one file per occupied unit.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Export Structure</CardDescription>
              <CardTitle className="text-2xl text-foreground">Final logo naming and placement logic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="rounded-[1.35rem] border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FolderTree className="h-4.5 w-4.5 text-primary" />
                  Directory tree
                </div>
                <div className="mt-3 rounded-[1rem] bg-secondary/70 p-4 font-mono text-xs leading-6 text-foreground" dir="ltr">
                  /logos/raw/\n
                  /logos/review/\n
                  /logos/final/
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Example final exports</p>
                <div className="mt-3 space-y-2 rounded-[1rem] bg-secondary/70 p-4 font-mono text-xs leading-6 text-foreground" dir="ltr">
                  {exportStructureExamples.map((path) => (
                    <p key={path}>{path}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Current export rule</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground" dir="ltr">
                  /logos/final/[UNIT]_[Normalized-Brand-Name].png
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="tenant-master" className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Tenant Master</p>
              <h2 className="text-2xl font-bold text-foreground">One row per occupied unit</h2>
            </div>
          </div>

          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Floor</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Tenant Provided Name</TableHead>
                    <TableHead>Normalized Display Name</TableHead>
                    <TableHead>Logo Status</TableHead>
                    <TableHead>Matched Asset</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantMasterRows.map((row) => (
                    <TableRow key={row.unit}>
                      <TableCell className="font-medium text-foreground">{floorLabels[row.floor]}</TableCell>
                      <TableCell className="font-semibold text-foreground" dir="ltr">{row.unit}</TableCell>
                      <TableCell>{row.tenantProvidedName}</TableCell>
                      <TableCell className="font-medium text-foreground">{row.normalizedDisplayName}</TableCell>
                      <TableCell><StatusBadge status={row.logoStatus} /></TableCell>
                      <TableCell className="text-muted-foreground">{row.matchedAsset ?? "Missing Logo"}</TableCell>
                      <TableCell className="min-w-[20rem] text-muted-foreground">{row.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="matching-matrix" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Logo Matching Matrix</p>
            <h2 className="text-2xl font-bold text-foreground">One row per tenant brand</h2>
          </div>

          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant Provided Name</TableHead>
                    <TableHead>Normalized Display Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Logo Status</TableHead>
                    <TableHead>Matched Asset</TableHead>
                    <TableHead>Execution Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logoMatchingMatrixRows.map((row) => (
                    <TableRow key={row.normalizedDisplayName}>
                      <TableCell>{row.tenantProvidedName}</TableCell>
                      <TableCell className="font-medium text-foreground">{row.normalizedDisplayName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {row.units.map((unit) => (
                            <span key={unit} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground" dir="ltr">
                              {unit}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={row.logoStatus} /></TableCell>
                      <TableCell className="text-muted-foreground">{row.matchedAsset ?? "Missing Logo"}</TableCell>
                      <TableCell className="min-w-[22rem] text-muted-foreground">{row.executionNote}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="missing-logos" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Missing Logos</p>
            <h2 className="text-2xl font-bold text-foreground">Only unresolved tenant marks</h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Missing Reason</TableHead>
                      <TableHead>Next Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingLogoRows.map((row) => (
                      <TableRow key={row.tenant}>
                        <TableCell className="font-medium text-foreground">{row.tenant}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {row.units.map((unit) => (
                              <span key={unit} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground" dir="ltr">
                                {unit}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{row.missingReason}</TableCell>
                        <TableCell className="text-muted-foreground">{row.nextAction}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
              <CardHeader className="space-y-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Placeholder Review</CardDescription>
                <CardTitle className="text-2xl text-foreground">Clear missing-logo placeholders</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-0 sm:grid-cols-2 xl:grid-cols-1">
                {missingLogoRows.slice(0, 5).map((row) => (
                  <div key={row.tenant} className="rounded-[1.35rem] border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
                    <LogoPlaceholder title={row.tenant} status="Missing" />
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{row.tenant}</p>
                        <p className="text-xs text-muted-foreground">{row.units.join(" / ")}</p>
                      </div>
                      <CircleHelp className="mt-0.5 h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminTenantAssets;