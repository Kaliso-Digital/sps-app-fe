export const STAGE_NEW           = 1 // New
export const STAGE_UNDER_REVIEW  = 2 // Under Review
export const STAGE_INVOICED      = 3 // Invoiced')
export const STAGE_ACCEPTED      = 4 // Accepted')
export const STAGE_PROCUREMENT   = 5 // Procurement In Progress
export const STAGE_GOODS_PARTIAL = 6 // Goods In House (Partially)
export const STAGE_GOODS_FULLY   = 7 // Goods In House (Fully)
export const STAGE_FULFILLED     = 8 // Fulfilled
export const STAGE_CANCELLED     = 9 // Cancelled
export const STAGE_CLOSED        = 10 // Closed
export const STAGE_PAID          = 11 // Paid

export const EDITABLE_STAGES     = [STAGE_NEW, STAGE_UNDER_REVIEW]
export const STAGE_NO_QUOTE      = [STAGE_INVOICED, STAGE_CANCELLED, STAGE_CLOSED, STAGE_PROCUREMENT, STAGE_GOODS_FULLY, STAGE_GOODS_PARTIAL,
                                    STAGE_FULFILLED, STAGE_PAID]
export const STAGE_NO_SUPPLIER   = [STAGE_INVOICED, STAGE_CANCELLED, STAGE_CLOSED, STAGE_PROCUREMENT, STAGE_GOODS_FULLY, STAGE_GOODS_PARTIAL,
                                    STAGE_FULFILLED, STAGE_PAID]
export const STAGE_NO_INVOICE    = STAGE_NO_QUOTE
export const STAGE_UPDATE_GRN    = [STAGE_PROCUREMENT, STAGE_GOODS_PARTIAL, STAGE_GOODS_PARTIAL]
export const STAGE_UPDATE_SHIPPING = [STAGE_GOODS_FULLY]