import os
from pathlib import Path


def generate_tree(start_path=".", max_depth=3, exclude_dirs=None, exclude_files=None):
    if exclude_dirs is None:
        exclude_dirs = {'.git', '__pycache__', '.idea', '.venv', 'venv', 'env', 'node_modules'}
    if exclude_files is None:
        exclude_files = {'.DS_Store', '.gitignore'}

    start_path = Path(start_path)

    def _tree(path, level=0, prefix=""):
        if level > max_depth:
            return

        # Get all items
        try:
            items = list(path.iterdir())
        except PermissionError:
            return

        # Sort directories first, then files
        items.sort(key=lambda x: (not x.is_dir(), x.name.lower()))

        for index, item in enumerate(items):
            if item.name.startswith('.'):
                continue

            if item.is_dir() and item.name in exclude_dirs:
                continue
            if item.is_file() and item.name in exclude_files:
                continue

            is_last = index == len(items) - 1
            connector = "└── " if is_last else "├── "

            print(f"{prefix}{connector}{item.name}")

            if item.is_dir():
                extension = "    " if is_last else "│   "
                _tree(item, level + 1, prefix + extension)

    print(f"{start_path.absolute().name}/")
    _tree(start_path)


if __name__ == "__main__":
    generate_tree(max_depth=4)