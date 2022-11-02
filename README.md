# Labeler Action

GitHub Action that labels a PR based on the source branch name prefix

## Inputs

### `branch_label_mappings`

**Required** A JSON formatted object that maps branch name prefixes to label names.

**Default** `'{"enhancement/":"enhancement","bug/":"bug"}'`

## Example usage

```yaml
uses: bradymholt/labeler-action@v1.0
with:
  branch_label_mappings: >-
    {
      "enhancement/":"enhancement",
      "bug/":"bug"
    }
```