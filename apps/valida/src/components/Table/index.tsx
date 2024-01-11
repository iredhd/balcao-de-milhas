
import { css, } from "@emotion/react"
import styled from "@emotion/styled"
import { DataGrid, ptBR, DataGridProps, GridToolbar } from "@mui/x-data-grid"

const StyledGrid = styled(DataGrid)`
    .MuiDataGrid-virtualScroller {
        min-height: 52px;
    }
`

export const Table = (props: DataGridProps) => {
    return (
        <StyledGrid
            localeText={{
                ...ptBR.components.MuiDataGrid.defaultProps.localeText,
                noRowsLabel: 'Não há registros'
            }}
            slots={{
                toolbar: GridToolbar,
            }}
            rowSelection={false}
            {...props}
        />
    )
}
