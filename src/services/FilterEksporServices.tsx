import { reportFetch } from "@/utils/api";

export interface OptionItem {
    kode?: string;
    uraian: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

const FilterEksporService = {
    getNegaraOptions: async (): Promise<OptionItem[]> => {
        const res = await reportFetch<ApiResponse<OptionItem[]>>("/filter-ekspor/negara");
        return res.data ?? [];
    },

    getUptOptions: async (): Promise<OptionItem[]> => {
        const res = await reportFetch<ApiResponse<OptionItem[]>>("/filter-ekspor/upt");
        return res.data ?? [];
    },

    getKomoditasOptions: async (): Promise<OptionItem[]> => {
        const res = await reportFetch<ApiResponse<OptionItem[]>>("/filter-ekspor/komoditas");
        return res.data ?? [];
    },
};

export default FilterEksporService;