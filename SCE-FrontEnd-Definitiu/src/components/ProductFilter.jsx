import React from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Slider, Button, Box, Typography } from '@mui/material';

const ProductFilter = ({ searchTerm, setSearchTerm, brand, setBrand, type, setType, priceRange, setPriceRange, handleSearch }) => {
  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <TextField
        label="Nom del producte"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={handleSearch}>Cercar</Button>
      <FormControl>
        <Typography gutterBottom>Rang de Preus (€)</Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `${value}€`}
          min={0}
          max={200} // Ajustar el rango máximo a 200€
        />
      </FormControl>
      <FormControl>
        <InputLabel>Marques</InputLabel>
        <Select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <MenuItem value=""><em>None</em></MenuItem> {/* Opción para indicar que no hay selección */}
          <MenuItem value="Leone">Leone</MenuItem>
          <MenuItem value="Venum">Venum</MenuItem>
          <MenuItem value="Nike">Nike</MenuItem>
          <MenuItem value="Everlast">Everlast</MenuItem>
          <MenuItem value="Evo">Evo</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Tipus</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value=""><em>None</em></MenuItem> {/* Opción para indicar que no hay selección */}
          <MenuItem value="Guants">Gloves</MenuItem>
          <MenuItem value="Botas">Boots</MenuItem>
          <MenuItem value="Cascs">Headgear</MenuItem>
          <MenuItem value="Sac">Bags</MenuItem>
          <MenuItem value="Mano">Pads</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProductFilter;
