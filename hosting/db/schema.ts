import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const rooms=sqliteTable("coop_rooms",{code:text("code").primaryKey(),creator:text("creator").notNull().unique(),revision:integer("revision").notNull(),payload:text("payload").notNull(),updated:integer("updated").notNull()});
