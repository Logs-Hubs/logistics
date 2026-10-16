"""A small command-line greeting application."""

import argparse


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Greet someone by name.")
    parser.add_argument("name", nargs="?", default="world", help="name to greet")
    return parser.parse_args()


def main() -> None:
    """Print a greeting for the requested name."""
    args = parse_args()
    print(f"Hello, {args.name}!")


if __name__ == "__main__":
    main()
