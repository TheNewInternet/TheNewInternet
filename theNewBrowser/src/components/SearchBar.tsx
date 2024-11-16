import React from "react";
import { Box, Button, IconButton, InputBase, Paper } from "@mui/material";
import { ArrowBack, ArrowForward, Refresh, Search } from "@mui/icons-material";

interface SearchBarProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void; // New prop for refresh functionality
}

export function SearchBar({
  url,
  onUrlChange,
  onSearch,
  onBack,
  onForward,
  onRefresh,
}: SearchBarProps) {
  return (
    <Paper
      sx={{
        bgcolor: "grey.50",
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <IconButton aria-label="Back" onClick={onBack} size="small">
        <ArrowBack />
      </IconButton>

      <IconButton aria-label="Forward" onClick={onForward} size="small">
        <ArrowForward />
      </IconButton>

      <IconButton aria-label="Refresh" onClick={onRefresh} size="small">
        <Refresh />
      </IconButton>

      <Box
        component="form"
        onSubmit={onSearch}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputBase
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          fullWidth
          sx={{
            px: 1,
            border: "1px solid #ccc",
            borderRadius: 2,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            ml: 2,
            bgcolor: "#f15d2f",
            "&:hover": { bgcolor: "#d14d1f" },
          }}
        >
          <Search />
        </Button>
      </Box>
    </Paper>
  );
}
