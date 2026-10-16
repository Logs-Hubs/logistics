"""Command-line tests for the greeting application."""

import subprocess
import sys
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
GREET_SCRIPT = REPOSITORY_ROOT / "greet.py"


class GreetCliTests(unittest.TestCase):
    """Verify the greeting application's user-facing output."""

    def run_greet(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        """Run greet.py with the supplied command-line arguments."""
        return subprocess.run(
            [sys.executable, str(GREET_SCRIPT), *arguments],
            check=False,
            capture_output=True,
            text=True,
        )

    def test_greets_world_by_default(self) -> None:
        result = self.run_greet()

        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "Hello, world!\n")
        self.assertEqual(result.stderr, "")

    def test_greets_supplied_name(self) -> None:
        result = self.run_greet("Alice")

        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "Hello, Alice!\n")
        self.assertEqual(result.stderr, "")

    def test_greets_world_in_uppercase(self) -> None:
        result = self.run_greet("--uppercase")

        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "HELLO, WORLD!\n")
        self.assertEqual(result.stderr, "")

    def test_greets_supplied_name_in_uppercase_with_flag_after_name(self) -> None:
        result = self.run_greet("Alice", "--uppercase")

        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "HELLO, ALICE!\n")
        self.assertEqual(result.stderr, "")

    def test_greets_supplied_name_in_uppercase_with_flag_before_name(self) -> None:
        result = self.run_greet("--uppercase", "Alice")

        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "HELLO, ALICE!\n")
        self.assertEqual(result.stderr, "")


if __name__ == "__main__":
    unittest.main()
