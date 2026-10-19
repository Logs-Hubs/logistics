# Development Workflow

## Linear integration

- Every coding task delegated from Linear must use the actual Linear issue identifier, such as `LOG-XX` with `XX` number.
- Never invent or substitute the Linear issue ID with the GitHub issue number.
- If the issue identifier is missing or ambiguous, request clarification before preparing the PR.

## Branch conventions

- Use `main` as the base branch.
- Never commit directly to `main`.
- When branch naming is controllable, prefer:
  `codex/<LINEAR-ID>-<short-description>`
- If Codex Cloud generates the branch name automatically, do not assume it contains the issue ID. Ensure the PR title and body identify the issue.

## Commit conventions

Use Conventional Commits when generating commit messages.

Example:
`feat (user): add user validation (LOG-XX)`

### Commit types

Use the following types when appropriate:

| Type | Purpose |
|---|---|
| `feat` | Introduce new functionality |
| `fix` | Fix an existing bug |
| `refactor` | Restructure code without changing its intended behavior |
| `perf` | Improve performance |
| `docs` | Update documentation |
| `test` | Add or modify tests |
| `chore` | Perform maintenance tasks |
| `build` | Modify dependencies or build configuration |
| `ci` | Modify CI/CD workflows |
| `style` | Make formatting-only changes |

### Commit scope

- Use a meaningful scope describing the affected component or module.
- Prefer scopes that match the existing project structure.
- Keep scope names short, descriptive, and consistent.
- Do not use the Linear identifier as the scope.

Examples:

- `feat (auth): add token validation (LOG-14)`
- `fix (database): resolve connection timeout (LOG-15)`
- `refactor (services): simplify user processing (LOG-16)`
- `test (api): add endpoint validation tests (LOG-17)`

### Commit message quality

- Use imperative language in commit descriptions.
- Keep descriptions concise and meaningful.
- Avoid generic descriptions such as `update code`, `fix stuff`, or `changes`.
- Each commit should represent a logically coherent change.
- Avoid mixing unrelated modifications into the same commit.
- Do not include unrelated formatting changes in feature commits.

## Code conventions

### General principles

- Write clean, readable, maintainable, and production-quality code.
- Prioritize correctness, clarity, simplicity, and consistency.
- Follow the existing project's architecture and conventions.
- Avoid unnecessary abstractions and overengineering.
- Apply the DRY principle where meaningful.
- Apply SOLID principles when appropriate.
- Keep code modular and responsibilities clearly separated.
- Prefer explicit behavior over implicit assumptions.
- Do not introduce unrelated changes when implementing an issue.

### Object-oriented programming

- Use classes for code mainly.
- Prefer class-based implementations for core application logic.
- Define attributes, methods for the class.
- Each class must have a clear and well-defined responsibility.
- Initialize instance attributes explicitly in `__init__`.
- Use class attributes for shared constants and instance attributes for object-specific state.
- Use private methods with a leading underscore for internal implementation details.
- Prefer composition over inheritance unless inheritance is justified.
- Avoid large classes with unrelated responsibilities.
- Use `@staticmethod`, `@classmethod`, and `@property` where appropriate.
- Use standalone functions for small, stateless utilities when introducing a class would add unnecessary complexity.

Example:

```python
class DataProcessor:
    """
    Process numerical datasets.

    Attributes:
        data (list[float]): Input dataset.
        normalize (bool): Enable normalization.
    """

    def __init__(
        self,
        data: list[float],
        normalize: bool = False,
    ) -> None:
        """
        Initialize the processor.

        Args:
            data (list[float]): Input numerical dataset.
            normalize (bool): Whether normalization is enabled.

        Returns:
            None
        """
        self.data = data
        self.normalize = normalize

    def process(self) -> list[float]:
        """
        Process the numerical dataset.

        Returns:
            list[float]: Processed values.
        """
        if not self.normalize:
            return self.data.copy()

        if not self.data:
            return []

        maximum = max(abs(value) for value in self.data)

        if maximum == 0:
            return self.data.copy()

        return [value / maximum for value in self.data]
```

### Type annotations

- Define functions signature with type of the inputs / outputs.
- All new functions and methods must include parameter and return type annotations.
- Explicitly use `-> None` for functions that do not return a value.
- Annotate attributes when this improves clarity.
- Prefer built-in generic types such as `list[str]`, `dict[str, int]`, and `tuple[int, int]`.
- Use `str | None` for optional values when supported by the project's Python version.
- Avoid `Any` unless necessary.
- Use `Path` from `pathlib` for filesystem paths.
- For scientific code, use appropriate NumPy or tensor annotations when practical.
- Preserve compatibility with the Python version specified by the repository.

### Documentation and docstrings

- Include docs as in the example.
- Use Google-style docstrings.
- All public classes, functions, and methods must have documentation.
- Document class responsibilities and relevant attributes.
- Document every parameter in an `Args` section.
- Document returned values in a `Returns` section.
- Document relevant exceptions in a `Raises` section.
- Document internal methods when their behavior is not immediately obvious.
- Keep docstrings accurate and synchronized with the implementation.
- Explain behavior, assumptions, and important constraints where necessary.

Example:

```python
def fnc(i: int) -> None:
    """
    Function description.

    Args:
        i (int): description here.

    Returns:
        None
    """
```

Extended example:

```python
def calculate_average(
    values: list[float],
    ignore_zeros: bool = False,
) -> float:
    """
    Calculate the average of numerical values.

    Args:
        values (list[float]): Input numerical values.
        ignore_zeros (bool): Whether to exclude zero values.

    Returns:
        float: Arithmetic average of the selected values.

    Raises:
        ValueError: If no valid values remain.
    """
    if ignore_zeros:
        values = [value for value in values if value != 0]

    if not values:
        raise ValueError("No valid values provided.")

    return sum(values) / len(values)
```

### Naming conventions

Follow PEP 8 naming conventions.

| Element | Convention | Example |
|---|---|---|
| Classes | PascalCase | `ImageProcessor` |
| Functions | snake_case | `load_image()` |
| Methods | snake_case | `calculate_metrics()` |
| Variables | snake_case | `image_width` |
| Constants | UPPER_SNAKE_CASE | `MAX_EPOCHS` |
| Internal methods | Leading underscore | `_validate_input()` |
| Modules | snake_case | `data_loader.py` |
| Packages | lowercase / snake_case | `image_processing` |

- Use descriptive names.
- Avoid ambiguous names such as `data1`, `tmp`, or `value2`.
- Avoid unnecessary abbreviations.
- Keep domain terminology consistent across modules.
- Use names that communicate intent rather than implementation details.

### Code architecture and organization

- Organize code into logically separated modules.
- Keep classes focused on a single responsibility.
- Separate application orchestration from business logic.
- Keep entry-point scripts such as `main.py` minimal.
- Avoid circular imports and wildcard imports.
- Group imports into standard-library, third-party, and local imports.
- Prefer dependency injection when it improves testability and maintainability.
- Do not create unnecessary layers or abstractions.
- Reuse existing architectural patterns before introducing new ones.

When appropriate, separate the following responsibilities:

- Configuration management
- Data loading
- Data preprocessing
- Core processing and services
- Database access
- API routing
- Model training and inference
- Evaluation and metrics
- Visualization
- File handling

Do not restructure the repository solely to match a preferred architecture unless explicitly requested.

### Functions and methods

- Keep functions and methods concise and focused.
- Prefer methods that perform one clearly defined operation.
- Avoid excessive nesting.
- Use guard clauses and early returns where they improve readability.
- Avoid hidden side effects.
- Do not modify input objects unexpectedly.
- Avoid mutable default arguments.
- Prefer keyword arguments when positional arguments would be ambiguous.
- Separate computation from I/O and visualization when practical.
- Reuse common logic instead of duplicating implementations.

### Error handling and input validation

- Validate inputs at appropriate boundaries.
- Raise specific exceptions rather than generic exceptions.
- Use informative error messages.
- Avoid bare `except:` blocks.
- Never silently suppress failures.
- Preserve exception context using `raise ... from exc` when appropriate.
- Do not use exceptions for ordinary control flow.
- Use context managers when working with files and external resources.
- Handle missing files, invalid configurations, and malformed data explicitly.
- Do not introduce silent fallback behavior unless it is an intended part of the requirements.

Example:

```python
from pathlib import Path


class FileLoader:
    """Load text content from filesystem paths."""

    def __init__(self, file_path: Path) -> None:
        """
        Initialize the file loader.

        Args:
            file_path (Path): File to load.

        Returns:
            None
        """
        self.file_path = file_path

    def load(self) -> str:
        """
        Read the file content.

        Returns:
            str: Loaded text content.

        Raises:
            FileNotFoundError: If the file does not exist.
            OSError: If the file cannot be read.
        """
        if not self.file_path.is_file():
            raise FileNotFoundError(
                f"File not found: {self.file_path}"
            )

        return self.file_path.read_text(encoding="utf-8")
```

### Logging

- Use the standard `logging` module for production application logs.
- Avoid using `print()` for production debugging.
- Use suitable logging levels: `DEBUG`, `INFO`, `WARNING`, `ERROR`, and `CRITICAL`.
- Include enough context to diagnose failures.
- Do not log secrets, credentials, tokens, or sensitive information.
- Avoid excessive logging in frequently executed loops.
- Remove temporary debugging statements before completing a task.
- Reuse existing logging configuration.

### Configuration management

- Avoid hardcoding environment-specific values.
- Store configurable parameters in configuration files, environment variables, or configuration classes.
- Define constants for meaningful fixed values.
- Avoid magic numbers.
- Validate configurations before use.
- Never commit passwords, API keys, tokens, or private credentials.
- Respect existing configuration conventions.
- Do not introduce a new configuration framework unless justified.

### Code formatting and quality

- Follow PEP 8.
- Follow the project's configured formatter and linter.
- Prefer existing tools such as Ruff, Black, or equivalent.
- Respect existing line-length rules.
- Remove unused imports and variables.
- Avoid commented-out code.
- Keep comments meaningful and concise.
- Do not add unnecessary lint suppression directives.
- Prefer readable implementations over compressed one-line expressions.
- Do not reformat unrelated files unless explicitly requested.

### Performance and resource management

- Prioritize correctness before optimization.
- Avoid repeated expensive operations when results can be reused.
- Avoid unnecessary data copies.
- Prefer vectorized operations for suitable numerical workloads.
- Use batching or streaming for large datasets when appropriate.
- Manage file handles and external resources correctly.
- Avoid introducing concurrency without a concrete reason.
- Measure performance before claiming improvements.
- Do not sacrifice readability for negligible optimizations.

### Scientific computing and machine learning

When working with AI, computer vision, data science, or machine learning components:

- Separate dataset loading, preprocessing, training, inference, and evaluation.
- Prefer classes for datasets, models, trainers, evaluators, and inference pipelines.
- Document expected array and tensor shapes.
- Document data types, value ranges, and channel ordering.
- Keep model hyperparameters configurable.
- Manage CPU and GPU device selection explicitly.
- Set reproducible random seeds when appropriate.
- Prevent data leakage between training, validation, and test sets.
- Preserve consistent preprocessing between training and inference.
- Use the correct training and evaluation modes for neural networks.
- Use `torch.no_grad()` or `torch.inference_mode()` when applicable.
- Store checkpoints and model metadata consistently.
- Record meaningful metrics and experiment parameters.
- Do not change evaluation protocols, loss functions, or scientific assumptions without explicit justification.

### Security

- Never hardcode credentials.
- Validate untrusted inputs.
- Use parameterized database queries.
- Avoid unsafe shell command construction.
- Respect existing authentication and authorization mechanisms.
- Avoid leaking sensitive information through logs or exceptions.
- Do not weaken security checks to make tests pass.
- Avoid destructive filesystem or database operations unless required.
- Do not introduce undocumented network calls or external data transfers.

### Backward compatibility

- Preserve existing public interfaces unless the issue explicitly requires changing them.
- Avoid unnecessary changes to method signatures.
- Preserve expected return types and existing contracts.
- Update dependent code when an interface change is necessary.
- Do not change configuration keys or file formats without justification.
- Keep modifications compatible with the project's supported runtime and dependencies.
- Identify and document breaking changes.

### Dependencies and environments

- Reuse existing dependencies whenever possible.
- Do not introduce unnecessary third-party libraries.
- Respect the existing dependency manager.
- Keep dependency declarations and lockfiles consistent.
- Do not change the Python version without explicit authorization.
- Prefer reproducible development environments.
- Avoid committing generated files, temporary artifacts, or local environment directories.

### Testing conventions

- Add or update automated tests for new features and bug fixes where appropriate.
- Prefer the testing framework already configured in the repository.
- Use `pytest` for Python projects when no framework is established.
- Keep tests deterministic and isolated.
- Cover expected behavior, edge cases, and error conditions.
- Use fixtures to avoid repeated setup.
- Mock external services when appropriate.
- Avoid tests that depend unnecessarily on network access.
- Add regression tests for fixed bugs when practical.
- Do not modify correct production behavior merely to satisfy an incorrect test.
- Do not claim tests passed unless they were successfully executed.

### Refactoring conventions

- Refactor only when required by the task or necessary for a correct implementation.
- Avoid unrelated architectural changes.
- Preserve existing behavior during refactoring.
- Prefer incremental, reviewable changes.
- Do not rename public classes, functions, or modules unnecessarily.
- Explain significant refactoring decisions.
- Add or update tests when refactoring complex logic.

### AI agent coding behavior

When generating or modifying code:

- Inspect relevant existing files before editing.
- Understand the current architecture before proposing changes.
- Prefer the smallest maintainable implementation.
- Follow existing patterns and naming conventions.
- Write complete implementations rather than placeholders.
- Do not introduce TODO comments as substitutes for required functionality.
- Avoid speculative improvements outside the requested scope.
- Do not overwrite unrelated modifications.
- Do not silently remove existing functionality.
- Explain meaningful technical decisions.
- Report any unverified assumptions or remaining limitations.

## Pull request conventions

- Target branch: `main`.
- Preferred PR state: Draft.
- PR title format:
  `LOG-X: Add user validation`
- Replace LOG-X with the actual Linear issue identifier.
- Include this exact closing reference in the PR description:
  `Fixes LOG-X`
- The PR description must summarize the changes and report tests performed.
- If the platform generates a different PR title or body, flag the mismatch for correction before merge.
- Never merge a pull request autonomously.

## Implementation and validation

- Implement only the scope requested by the Linear issue.
- Add or update automated tests as appropriate.
- Run relevant tests and report their actual results.
- Do not claim tests passed unless they were executed successfully.
- Report any failing or skipped tests.

### Pre-implementation checks

- Read the Linear issue requirements and acceptance criteria.
- Identify the affected components and dependencies.
- Inspect relevant code and existing tests.
- Determine whether the project already provides reusable functionality.
- Identify potential compatibility or security implications.
- Do not expand the issue scope without justification.

### Validation checks

When applicable and supported by the repository:

- Run targeted unit tests.
- Run relevant integration tests.
- Execute the project's linting checks.
- Execute the project's formatting checks.
- Run static type checking if configured.
- Verify that the implementation satisfies the Linear issue's acceptance criteria.
- Review the final diff for unrelated modifications.
- Check that no sensitive data or temporary artifacts were introduced.

### Validation reporting

- Distinguish between passed, failed, skipped, and not-executed checks.
- Provide the actual command used when reporting test execution.
- Report failures with sufficient context.
- Explain why any relevant check could not be executed.
- Do not fabricate test outcomes.
- Do not mark an implementation as fully verified if essential checks remain incomplete.

## Delivery

When finished, report:

1. Linear issue ID.
2. Files changed.
3. Implementation summary.
4. Tests executed and results.
5. Proposed branch name, PR title and PR description.
6. Any limitations or unresolved problems.

Leave final PR publication, review and merge under human control.

### Delivery report details

The final report should be concise, factual, and directly related to the Linear issue.

For files changed:

- Identify added, modified, and deleted files when relevant.
- Explain the purpose of significant file modifications.

For implementation:

- Summarize the implemented functionality.
- Describe significant architectural or technical decisions.
- Identify deviations from the original requirements.

For testing:

- State which commands were actually executed.
- Report their outcomes.
- Identify tests that failed, were skipped, or could not run.

For proposed Git and PR information:

- Use the actual Linear issue identifier.
- Report the proposed branch name.
- Report the proposed PR title.
- Include the proposed PR description with the required Linear closing reference.
- Do not claim that a branch or PR was created unless it was actually created.

For limitations:

- Report unresolved issues or incomplete requirements.
- Identify assumptions requiring human review.
- Flag compatibility or deployment concerns when relevant.

### Completion checklist

Before reporting completion, verify:

- [ ] Implementation matches the Linear issue scope.
- [ ] Existing architecture and conventions are respected.
- [ ] Appropriate type annotations are present.
- [ ] Required documentation and docstrings are present.
- [ ] Error handling and input validation are appropriate.
- [ ] Relevant tests have been added or updated.
- [ ] Available validation checks have been executed.
- [ ] Results are reported accurately.
- [ ] No unrelated modifications were introduced.
- [ ] No secrets or temporary debugging artifacts were committed.
- [ ] Linear references use the actual issue identifier.
- [ ] Proposed branch and PR naming follow the defined conventions.
- [ ] Any limitations or unresolved problems are reported.
- [ ] Final PR publication, review, and merge remain under human control.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
