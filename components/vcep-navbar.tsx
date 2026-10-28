'use client';

import React, { useState, useEffect, useRef } from 'react';
import BrandLogo from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import {
  Bell,
  BookOpen,
  ChevronDown,
  LogOut,
  Menu,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  User,
  X,
} from 'lucide-react';

export interface VcepNavbarProps {
  user: {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'faculty' | 'student' | 'pending' | string;
    cohort?: string;
    studentId?: string;
    consent?: number;
  } | null;
  selected: number;
  student: boolean;
  staff: boolean;
  browse: boolean;
  practiceMode: boolean;
  notice: boolean;
  notifications?: Array<{ id: string | number; seen?: boolean; message?: string; created?: string }>;
  onToggleNotice: () => void;
  onNavigateHome: () => void;
  onNavigateSessionLab: () => void;
  onNavigateManagement: () => void;
}

export default function VcepNavbar({
  user,
  selected,
  student,
  staff,
  browse,
  practiceMode,
  notice,
  notifications = [],
  onToggleNotice,
  onNavigateHome,
  onNavigateSessionLab,
  onNavigateManagement,
}: VcepNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Unread notifications count from real data
  const unseenCount = notifications.filter((n) => !n.seen).length;

  // Lightweight, passive scroll handler
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside clicks and Escape key to close dropdowns
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !(e.target as HTMLElement)?.closest('.vcep-mobile-toggle-btn')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Format verified display name
  const displayName = user
    ? user.role === 'admin'
      ? user.name &&
        !user.name.includes('@') &&
        !user.name.includes('-uid') &&
        user.name !== 'Admin'
        ? user.name
        : 'VCEP Programme Administrator'
      : user.name || user.email.split('@')[0]
    : '';

  // Compact role badge label
  const roleBadgeLabel = user
    ? user.role === 'admin'
      ? 'Admin'
      : user.role === 'faculty'
      ? 'Faculty'
      : user.role === 'pending'
      ? 'Awaiting enrolment'
      : 'Student'
    : '';

  // Full role title for dropdown
  const roleTitle = user
    ? user.role === 'admin'
      ? 'Programme Administrator'
    : user.role === 'faculty'
      ? 'Faculty Member'
    : user.role === 'pending'
      ? 'Awaiting Enrolment'
    : 'Student Learner'
    : '';

  // Initials for avatar circle
  const avatarInitials = (() => {
    if (!user) return 'VC';
    if (user.role === 'admin') return 'VA';
    if (user.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  })();

  // Active view states
  const isManagementActive = staff && !browse && selected === 0;
  const isSessionLabActive = selected > 0;

  return (
    <header
      className={`vcep-header vcep-glass-header no-print ${
        isScrolled ? 'vcep-header-scrolled' : ''
      }`}
      role="banner"
    >
      {/* LEFT: Brand Identity */}
      <div className="vcep-header-brand-wrap">
        <button
          type="button"
          className="brand !bg-transparent !p-0 !border-0 text-left cursor-pointer transition-opacity hover:opacity-95"
          onClick={onNavigateHome}
          aria-label="Vayentra Commerce WorkLab — Return to Homepage"
        >
          <BrandLogo size="md" />
        </button>
      </div>

      {/* RIGHT: Compact Action Group */}
      <nav className="vcep-header-nav" aria-label="Main Navigation">
        <div className="vcep-header-actions">
          {/* 1. Session Lab */}
          <Button
            variant="outline"
            className={`vcep-nav-btn ${isSessionLabActive ? 'vcep-nav-btn-active' : ''}`}
            onClick={onNavigateSessionLab}
            aria-current={isSessionLabActive ? 'page' : undefined}
          >
            <BookOpen className="size-3.5 text-[#0F766E]" aria-hidden="true" />
            <span>Session Lab</span>
          </Button>

          {/* 2. Management Workspace (Staff only) */}
          {staff && (
            <Button
              variant="outline"
              className={`vcep-nav-btn ${isManagementActive ? 'vcep-nav-btn-active' : ''}`}
              onClick={onNavigateManagement}
              aria-current={isManagementActive ? 'page' : undefined}
            >
              <SlidersHorizontal className="size-3.5 text-[#17245C]" aria-hidden="true" />
              <span>Management</span>
            </Button>
          )}

          {/* 3. Updates Icon Button (When signed in) */}
          {user && (
            <button
              type="button"
              className={`vcep-nav-icon-btn vcep-updates-btn ${
                notice ? 'vcep-nav-icon-btn-active' : ''
              }`}
              onClick={onToggleNotice}
              aria-label={`Workspace updates${
                unseenCount > 0 ? `, ${unseenCount} unread` : ''
              }`}
              title="Workspace updates"
            >
              <Bell className="size-4" aria-hidden="true" />
              {unseenCount > 0 && (
                <span className="vcep-updates-badge" aria-hidden="true">
                  {unseenCount}
                </span>
              )}
            </button>
          )}

          {/* 4. Profile Avatar & Dropdown (When signed in) */}
          {user ? (
            <div className="vcep-nav-profile-container" ref={profileRef}>
              <button
                type="button"
                className={`vcep-nav-avatar-btn ${
                  isProfileOpen ? 'vcep-nav-avatar-btn-open' : ''
                }`}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                aria-label={`Account menu for ${displayName}`}
              >
                <div
                  className={`vcep-avatar-circle vcep-avatar-${user.role}`}
                  aria-hidden="true"
                >
                  {avatarInitials}
                </div>
                <span className="vcep-avatar-role-text">{roleBadgeLabel}</span>
                <ChevronDown
                  className={`size-3.5 vcep-avatar-chevron ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Premium Floating Profile Dropdown */}
              {isProfileOpen && (
                <div
                  className="vcep-profile-dropdown"
                  role="menu"
                  aria-label="Account options"
                >
                  {/* Verified Identity Header */}
                  <div className="vcep-dropdown-identity">
                    <div className="vcep-dropdown-user-row">
                      <div
                        className={`vcep-dropdown-avatar vcep-avatar-${user.role}`}
                        aria-hidden="true"
                      >
                        {avatarInitials}
                      </div>
                      <div className="vcep-dropdown-user-info">
                        <span className="vcep-dropdown-user-name" title={displayName}>
                          {displayName}
                        </span>
                        <span className="vcep-dropdown-user-email" title={user.email}>
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="vcep-dropdown-meta-strip">
                      <span className={`vcep-role-chip vcep-role-${user.role}`}>
                        <ShieldCheck className="size-3" aria-hidden="true" />
                        <span>{roleTitle}</span>
                      </span>
                      {user.studentId && (
                        <span className="vcep-id-chip">
                          ID: {user.studentId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="vcep-dropdown-divider" />

                  {/* Navigation Shortcuts */}
                  <div className="vcep-dropdown-section" role="group" aria-label="WorkLab Navigation">
                    <button
                      type="button"
                      role="menuitem"
                      className="vcep-dropdown-item"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigateSessionLab();
                      }}
                    >
                      <BookOpen className="size-4 text-[#0F766E]" aria-hidden="true" />
                      <span>Session Lab (24 Sessions)</span>
                    </button>
                    {staff && (
                      <button
                        type="button"
                        role="menuitem"
                        className="vcep-dropdown-item"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigateManagement();
                        }}
                      >
                        <SlidersHorizontal className="size-4 text-[#17245C]" aria-hidden="true" />
                        <span>Management Workspace</span>
                      </button>
                    )}
                  </div>

                  <div className="vcep-dropdown-divider" />

                  {/* Institutional Programme Links */}
                  <div className="vcep-dropdown-section" role="group" aria-label="Programme Information">
                    <a
                      href="/programme"
                      role="menuitem"
                      className="vcep-dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Sparkles className="size-4 text-[#E5AF2E]" aria-hidden="true" />
                      <span>Programme Vision &amp; Delivery</span>
                    </a>
                    <a
                      href="/privacy"
                      role="menuitem"
                      className="vcep-dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ShieldCheck className="size-4 text-[#64748B]" aria-hidden="true" />
                      <span>Privacy &amp; Participation</span>
                    </a>
                  </div>

                  <div className="vcep-dropdown-divider" />

                  {/* Sign Out Action */}
                  <div className="vcep-dropdown-footer">
                    <a
                      href="/signout?return_to=%2F"
                      target="_top"
                      role="menuitem"
                      className="vcep-dropdown-item vcep-dropdown-signout"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      <span>Sign out</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button className="vcep-nav-btn vcep-signin-btn" asChild>
              <a href="/signin?return_to=%2F" target="_top">
                <User className="size-3.5" aria-hidden="true" />
                <span>Sign in</span>
              </a>
            </Button>
          )}

          {/* 5. Mobile Menu Toggle Button (Visible on <= 767px) */}
          <button
            type="button"
            className="vcep-mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Visible on <= 767px when toggled) */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="vcep-mobile-drawer"
          role="dialog"
          aria-label="Mobile Navigation"
        >
          {user && (
            <div className="vcep-mobile-drawer-identity">
              <div
                className={`vcep-avatar-circle vcep-avatar-${user.role}`}
                aria-hidden="true"
              >
                {avatarInitials}
              </div>
              <div className="vcep-mobile-drawer-details">
                <span className="vcep-mobile-user-name">{displayName}</span>
                <span className="vcep-mobile-user-role">{roleTitle}</span>
              </div>
            </div>
          )}

          <div className="vcep-mobile-drawer-links">
            <button
              type="button"
              className="vcep-mobile-drawer-link"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateSessionLab();
              }}
            >
              <BookOpen className="size-4 text-[#0F766E]" aria-hidden="true" />
              <span>Session Lab</span>
            </button>

            {staff && (
              <button
                type="button"
                className="vcep-mobile-drawer-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateManagement();
                }}
              >
                <SlidersHorizontal className="size-4 text-[#17245C]" aria-hidden="true" />
                <span>Management Workspace</span>
              </button>
            )}

            {user && (
              <button
                type="button"
                className="vcep-mobile-drawer-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleNotice();
                }}
              >
                <Bell className="size-4 text-[#0F766E]" aria-hidden="true" />
                <span>Workspace Updates</span>
                {unseenCount > 0 && (
                  <span className="vcep-updates-badge ml-auto">
                    {unseenCount}
                  </span>
                )}
              </button>
            )}

            <a
              href="/programme"
              className="vcep-mobile-drawer-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Sparkles className="size-4 text-[#E5AF2E]" aria-hidden="true" />
              <span>Programme Vision</span>
            </a>

            <a
              href="/privacy"
              className="vcep-mobile-drawer-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShieldCheck className="size-4 text-[#64748B]" aria-hidden="true" />
              <span>Privacy &amp; Participation</span>
            </a>
          </div>

          <div className="vcep-mobile-drawer-footer">
            {user ? (
              <a
                href="/signout?return_to=%2F"
                target="_top"
                className="vcep-mobile-signout-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span>Sign out</span>
              </a>
            ) : (
              <a
                href="/signin?return_to=%2F"
                target="_top"
                className="vcep-mobile-signin-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="size-4" aria-hidden="true" />
                <span>Sign in</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
