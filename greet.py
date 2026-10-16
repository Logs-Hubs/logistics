"""A small command-line greeting application."""

import argparse


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Greet someone by name.")
    parser.add_argument("name", nargs="?", default="world", help="name to greet")
    parser.add_argument(
        "--uppercase",
        action="store_true",
        help="print the greeting in uppercase",
    )
    return parser.parse_args()


def main() -> None:
    """Print a greeting for the requested name."""
    args = parse_args()
    greeting = f"Hello, {args.name}!"
    if args.uppercase:
        greeting = greeting.upper()
    print(greeting)


if __name__ == "__main__":
    main()
