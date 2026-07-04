import {
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm";

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "ASC" | "DESC";

  [key: string]: any;
}

export interface FilterConfig {
  filterable: Record<string, string>;
  searchable: string[];
  sortable: Record<string, string>;
}

export class SearchAndFilterService<
  T extends ObjectLiteral
> {
  constructor(
    private qb: SelectQueryBuilder<T>,
    private config: FilterConfig
  ) {}

  apply(params: QueryParams) {
    this.applyFilters(params);
    this.applySearch(params.search);
    this.applySorting(
      params.sort,
      params.order
    );
    this.applyPagination(
      Number(params.page),
      Number(params.count)
    );

    return this.qb;
  }

  private applyFilters(
    params: QueryParams
  ): void {
    for (const [key, value] of Object.entries(
      params
    )) {
      if (
        [
          "page",
          "limit",
          "search",
          "sort",
          "order",
        ].includes(key)
      ) {
        continue;
      }

      const [
        filterName,
        operator = "eq",
      ] = key.split("__");

      const column =
        this.config.filterable[
          filterName
        ];

      if (!column || value == null) {
        continue;
      }

      const paramKey = `${filterName}_${operator}`;

      switch (operator) {
        case "eq":
          this.qb.andWhere(
            `${column} = :${paramKey}`,
            {
              [paramKey]: value,
            }
          );
          break;

        case "ne":
          this.qb.andWhere(
            `${column} != :${paramKey}`,
            {
              [paramKey]: value,
            }
          );
          break;

        case "gt":
          this.qb.andWhere(
            `${column} > :${paramKey}`,
            {
              [paramKey]: value,
            }
          );
          break;

        case "gte":
          this.qb.andWhere(
            `${column} >= :${paramKey}`,
            {
              [paramKey]: value,
            }
          );
          break;

        case "lt":
          this.qb.andWhere(
            `${column} < :${paramKey}`,
            {
              [paramKey]: value,
            }
          );
          break;

        case "lte":
          this.qb.andWhere(
            `${column} <= :${paramKey}`,
            {
              [paramKey]: value,
            }
          );
          break;

        case "like":
          this.qb.andWhere(
            `${column} ILIKE :${paramKey}`,
            {
              [paramKey]: `%${value}%`,
            }
          );
          break;

        case "in":
          this.qb.andWhere(
            `${column} IN (:...${paramKey})`,
            {
              [paramKey]:
                typeof value === "string"
                  ? value.split(",")
                  : value,
            }
          );
          break;

        case "isnull":
          this.qb.andWhere(
            `${column} IS NULL`
          );
          break;

        case "notnull":
          this.qb.andWhere(
            `${column} IS NOT NULL`
          );
          break;
      }
    }
  }

  private applySearch(
    search?: string
  ): void {
    if (
      !search ||
      !this.config.searchable.length
    ) {
      return;
    }

    const conditions =
      this.config.searchable.map(
        (column) =>
          `${column} ILIKE :search`
      );

    this.qb.andWhere(
      `(${conditions.join(" OR ")})`,
      {
        search: `%${search}%`,
      }
    );
  }

  private applySorting(
    sort?: string,
    order?: string
  ): void {
    if (!sort) {
      return;
    }

    const column =
      this.config.sortable[sort];

    if (!column) {
      return;
    }

    this.qb.orderBy(
      column,
      order === "ASC"
        ? "ASC"
        : "DESC"
    );
  }

  private applyPagination(
    page = 1,
    limit = 20
  ): void {
    page = page > 0 ? page : 1;
    limit =
      limit > 0
        ? Math.min(limit, 100)
        : 20;

    this.qb.take(limit);
    this.qb.skip(
      (page - 1) * limit
    );
  }
}