#!/usr/bin/env python3
import sys
import argparse
from pathlib import Path

# Add apps/api to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "apps" / "api"))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.services.analysis_service import AnalysisService
from app.models.schemas import ImpactRequest, ArchaeologyRequest

def main():
    parser = argparse.ArgumentParser(
        prog="dependency-detective",
        description="Investigate the impact before you change a dependency."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Analyze
    analyze_parser = subparsers.add_parser("analyze", help="Analyze repository dependencies and usage")
    analyze_parser.add_argument("repo_path", nargs="?", default="demo-repository", help="Path to target repository")

    # Investigate
    investigate_parser = subparsers.add_parser("investigate", help="Investigate change impact of a dependency")
    investigate_parser.add_argument("dependency_name", help="Name of dependency (e.g. axios, lodash)")
    investigate_parser.add_argument("--repo", default="demo-repository", help="Path to target repository")
    investigate_parser.add_argument("--version", default="latest", help="Target version to simulate")

    # Archaeology
    archaeology_parser = subparsers.add_parser("archaeology", help="Investigate why a dependency exists in git history")
    archaeology_parser.add_argument("dependency_name", help="Name of dependency")
    archaeology_parser.add_argument("--repo", default="demo-repository", help="Path to target repository")

    args = parser.parse_args()

    if args.command == "analyze":
        print(f"\n🔍 Analyzing repository at: {args.repo_path}")
        analysis = AnalysisService.analyze_repository(args.repo_path)
        stats = analysis.stats
        print(f"✓ Repository: {analysis.repo_name}")
        print(f"✓ Ecosystems: {', '.join(analysis.language_ecosystems)}")
        print(f"✓ Dependencies: {stats.total_dependencies} ({stats.direct_dependencies} direct, {stats.transitive_dependencies} transitive)")
        print(f"✓ High Impact Dependencies: {stats.high_impact_dependencies}")
        print(f"✓ Potentially Removable: {stats.potentially_removable}")
        print(f"✓ Total Source References: {stats.total_source_references}")
        print(f"✓ Relevant Git Commits: {stats.total_relevant_commits}\n")

    elif args.command == "investigate":
        print(f"\n🔍 Investigating impact for '{args.dependency_name}' in {args.repo}...")
        report = AnalysisService.investigate_impact(
            ImpactRequest(repo_path=args.repo, dependency_name=args.dependency_name, target_version=args.version)
        )
        print(f"\n--- CHANGE IMPACT REPORT ---")
        print(f"Package: {report.dependency_name} ({report.current_version} -> {report.target_version})")
        print(f"Risk Level: [{report.risk_level.value}]")
        print(f"Direct Files Affected: {report.direct_files_affected}")
        print(f"Transitive Files Affected: {report.transitive_files_affected}")
        print(f"Tests to Review: {report.tests_to_review}")
        print(f"\nAI Reasoner:\n  {report.ai_explanation}")
        print(f"\nRecommended Actions:")
        for act in report.recommended_actions:
            print(f"  • {act}")
        print(f"\nEvidence Count: {len(report.evidence)} snippet(s)\n")

    elif args.command == "archaeology":
        print(f"\n🔍 Running Dependency Archaeology for '{args.dependency_name}' in {args.repo}...")
        report = AnalysisService.investigate_archaeology(
            ArchaeologyRequest(repo_path=args.repo, dependency_name=args.dependency_name)
        )
        print(f"\n--- DEPENDENCY ARCHAEOLOGY REPORT ---")
        print(f"Package: {report.dependency_name}")
        print(f"Introduced Date: {report.introduced_date}")
        print(f"Introduced Commit: {report.introduced_commit} by {report.introduced_author}")
        print(f"Original Purpose: {report.original_purpose}")
        print(f"Current Usage Count: {report.current_usage_files_count} file(s)")
        print(f"Potentially Removable: {'YES' if report.is_potentially_removable else 'NO'}")
        print(f"\nTimeline Events:")
        for ev in report.timeline:
            print(f"  [{ev.date}] {ev.title} ({ev.commit_hash}) - {ev.description}")
        print(f"\nAI Summary:\n  {report.ai_summary}\n")

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
