import { Link } from "@tanstack/react-router";
import { Bell, ChevronsUpDown, Home } from "lucide-react";
import type { ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MockBadge } from "@/components/shared/MockBadge";
import type { AreaConfig } from "./nav";

export function AppShell({ area, children }: { area: AreaConfig; children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent" aria-label="Switch portal">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">SB</span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold">{area.label} portal</span>
                  <span className="truncate text-xs opacity-70">{area.subtitle}</span>
                </span>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuLabel>Switch portal (preview)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/app/talent">Talent — Amara Nakato</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/app/org/$orgId" params={{ orgId: "pearl-fintech" }}>Employer — Pearl Fintech</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/app/org/$orgId/partner" params={{ orgId: "makerere" }}>Partner — Makerere Career Office</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/app/admin">Platform admin</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {area.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <Link
                        to={item.to as "/"}
                        params={item.params as never}
                        activeOptions={{ exact: !!item.exact }}
                        activeProps={{ "data-active": true }}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Public website"><Link to="/"><Home /><span>Public website</span></Link></SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur">
          <SidebarTrigger />
          <span className="text-sm font-medium text-muted-foreground">{area.label} portal</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex"><MockBadge label="Prototype preview" /></span>
            {area.key === "talent" && (
              <Button asChild variant="ghost" size="icon" aria-label="Notifications"><Link to="/app/talent/notifications"><Bell /></Link></Button>
            )}
            <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{area.subtitle.slice(0, 2).toUpperCase()}</span>
          </div>
        </header>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
