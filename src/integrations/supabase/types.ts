export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ArPRoducts: {
        Row: {
          cle: number
          id: string | null
          produit: string | null
        }
        Insert: {
          cle: number
          id?: string | null
          produit?: string | null
        }
        Update: {
          cle?: number
          id?: string | null
          produit?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          user_email: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          user_email?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          user_email?: string | null
        }
        Relationships: []
      }
      bic: {
        Row: {
          cat: string | null
          id: number | null
          name: string | null
        }
        Insert: {
          cat?: string | null
          id?: number | null
          name?: string | null
        }
        Update: {
          cat?: string | null
          id?: number | null
          name?: string | null
        }
        Relationships: []
      }
      bignos: {
        Row: {
          alternatives: Json | null
          alternativesb: Json | null
          article: string | null
          ban: boolean | null
          categorie: string | null
          categorieold: string | null
          globalcategory: string | null
          hidden: boolean | null
          id: number
          marque: string | null
          marque_id: number | null
          name: string | null
          namebic: string | null
          photo_url: string | null
          prix: string | null
        }
        Insert: {
          alternatives?: Json | null
          alternativesb?: Json | null
          article?: string | null
          ban?: boolean | null
          categorie?: string | null
          categorieold?: string | null
          globalcategory?: string | null
          hidden?: boolean | null
          id?: number
          marque?: string | null
          marque_id?: number | null
          name?: string | null
          namebic?: string | null
          photo_url?: string | null
          prix?: string | null
        }
        Update: {
          alternatives?: Json | null
          alternativesb?: Json | null
          article?: string | null
          ban?: boolean | null
          categorie?: string | null
          categorieold?: string | null
          globalcategory?: string | null
          hidden?: boolean | null
          id?: number
          marque?: string | null
          marque_id?: number | null
          name?: string | null
          namebic?: string | null
          photo_url?: string | null
          prix?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bignos_marque_id_fkey"
            columns: ["marque_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      bignos_ref: {
        Row: {
          marque: string | null
          mop: string | null
          pho: string | null
        }
        Insert: {
          marque?: string | null
          mop?: string | null
          pho?: string | null
        }
        Update: {
          marque?: string | null
          mop?: string | null
          pho?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          ban: boolean | null
          categorie: string | null
          created_at: string | null
          filename: string | null
          id: number
          image_url: string | null
          marque: string | null
          name: string | null
          priority: boolean | null
          proof: string | null
          proof_url: string | null
          published_at: string | null
          reason: string | null
          tags: string | null
          updated_at: string | null
        }
        Insert: {
          ban?: boolean | null
          categorie?: string | null
          created_at?: string | null
          filename?: string | null
          id?: number
          image_url?: string | null
          marque?: string | null
          name?: string | null
          priority?: boolean | null
          proof?: string | null
          proof_url?: string | null
          published_at?: string | null
          reason?: string | null
          tags?: string | null
          updated_at?: string | null
        }
        Update: {
          ban?: boolean | null
          categorie?: string | null
          created_at?: string | null
          filename?: string | null
          id?: number
          image_url?: string | null
          marque?: string | null
          name?: string | null
          priority?: boolean | null
          proof?: string | null
          proof_url?: string | null
          published_at?: string | null
          reason?: string | null
          tags?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chkIsl: {
        Row: {
          all: string | null
          id: number
        }
        Insert: {
          all?: string | null
          id: number
        }
        Update: {
          all?: string | null
          id?: number
        }
        Relationships: []
      }
      contributions: {
        Row: {
          alt_description: string | null
          alt_image: string | null
          alt_name: string | null
          created_at: string
          id: number
          product_name: string | null
          rating: number | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alt_description?: string | null
          alt_image?: string | null
          alt_name?: string | null
          created_at?: string
          id?: number
          product_name?: string | null
          rating?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alt_description?: string | null
          alt_image?: string | null
          alt_name?: string | null
          created_at?: string
          id?: number
          product_name?: string | null
          rating?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contributionsol: {
        Row: {
          alt_description: string | null
          alt_image: string | null
          alt_name: string | null
          created_at: string | null
          id: string
          product_name: string | null
          rating: string | null
        }
        Insert: {
          alt_description?: string | null
          alt_image?: string | null
          alt_name?: string | null
          created_at?: string | null
          id?: string
          product_name?: string | null
          rating?: string | null
        }
        Update: {
          alt_description?: string | null
          alt_image?: string | null
          alt_name?: string | null
          created_at?: string | null
          id?: string
          product_name?: string | null
          rating?: string | null
        }
        Relationships: []
      }
      keywords: {
        Row: {
          keyword: string | null
        }
        Insert: {
          keyword?: string | null
        }
        Update: {
          keyword?: string | null
        }
        Relationships: []
      }
      links: {
        Row: {
          fullpath: string | null
          id: number
          lastpath: string | null
          parentpath: string | null
        }
        Insert: {
          fullpath?: string | null
          id?: number
          lastpath?: string | null
          parentpath?: string | null
        }
        Update: {
          fullpath?: string | null
          id?: number
          lastpath?: string | null
          parentpath?: string | null
        }
        Relationships: []
      }
      marques: {
        Row: {
          bigno: string | null
          categorie: string | null
          id: number
          lien: string | null
          logo: string | null
          marque: string | null
        }
        Insert: {
          bigno?: string | null
          categorie?: string | null
          id?: number
          lien?: string | null
          logo?: string | null
          marque?: string | null
        }
        Update: {
          bigno?: string | null
          categorie?: string | null
          id?: number
          lien?: string | null
          logo?: string | null
          marque?: string | null
        }
        Relationships: []
      }
      ModelDifference: {
        Row: {
          ContextId: string | null
          GCRecord: number | null
          Oid: string
          OptimisticLockField: number | null
          UserId: string | null
          Version: number | null
        }
        Insert: {
          ContextId?: string | null
          GCRecord?: number | null
          Oid: string
          OptimisticLockField?: number | null
          UserId?: string | null
          Version?: number | null
        }
        Update: {
          ContextId?: string | null
          GCRecord?: number | null
          Oid?: string
          OptimisticLockField?: number | null
          UserId?: string | null
          Version?: number | null
        }
        Relationships: []
      }
      ModelDifferenceAspect: {
        Row: {
          GCRecord: number | null
          Name: string | null
          Oid: string
          OptimisticLockField: number | null
          Owner: string | null
          Xml: string | null
        }
        Insert: {
          GCRecord?: number | null
          Name?: string | null
          Oid: string
          OptimisticLockField?: number | null
          Owner?: string | null
          Xml?: string | null
        }
        Update: {
          GCRecord?: number | null
          Name?: string | null
          Oid?: string
          OptimisticLockField?: number | null
          Owner?: string | null
          Xml?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_ModelDifferenceAspect_Owner"
            columns: ["Owner"]
            isOneToOne: false
            referencedRelation: "ModelDifference"
            referencedColumns: ["Oid"]
          },
        ]
      }
      PermissionPolicyActionPermissionObject: {
        Row: {
          ActionId: string | null
          GCRecord: number | null
          Oid: string
          OptimisticLockField: number | null
          Role: string | null
        }
        Insert: {
          ActionId?: string | null
          GCRecord?: number | null
          Oid: string
          OptimisticLockField?: number | null
          Role?: string | null
        }
        Update: {
          ActionId?: string | null
          GCRecord?: number | null
          Oid?: string
          OptimisticLockField?: number | null
          Role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyActionPermissionObject_Role"
            columns: ["Role"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyRole"
            referencedColumns: ["Oid"]
          },
        ]
      }
      PermissionPolicyMemberPermissionsObject: {
        Row: {
          Criteria: string | null
          GCRecord: number | null
          Members: string | null
          Oid: string
          OptimisticLockField: number | null
          ReadState: number | null
          TypePermissionObject: string | null
          WriteState: number | null
        }
        Insert: {
          Criteria?: string | null
          GCRecord?: number | null
          Members?: string | null
          Oid: string
          OptimisticLockField?: number | null
          ReadState?: number | null
          TypePermissionObject?: string | null
          WriteState?: number | null
        }
        Update: {
          Criteria?: string | null
          GCRecord?: number | null
          Members?: string | null
          Oid?: string
          OptimisticLockField?: number | null
          ReadState?: number | null
          TypePermissionObject?: string | null
          WriteState?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyMemberPermissionsObject_TypePermissionObject"
            columns: ["TypePermissionObject"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyTypePermissionsObject"
            referencedColumns: ["Oid"]
          },
        ]
      }
      PermissionPolicyNavigationPermissionsObject: {
        Row: {
          GCRecord: number | null
          ItemPath: string | null
          NavigateState: number | null
          Oid: string
          OptimisticLockField: number | null
          Role: string | null
        }
        Insert: {
          GCRecord?: number | null
          ItemPath?: string | null
          NavigateState?: number | null
          Oid: string
          OptimisticLockField?: number | null
          Role?: string | null
        }
        Update: {
          GCRecord?: number | null
          ItemPath?: string | null
          NavigateState?: number | null
          Oid?: string
          OptimisticLockField?: number | null
          Role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyNavigationPermissionsObject_Role"
            columns: ["Role"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyRole"
            referencedColumns: ["Oid"]
          },
        ]
      }
      PermissionPolicyObjectPermissionsObject: {
        Row: {
          Criteria: string | null
          DeleteState: number | null
          GCRecord: number | null
          NavigateState: number | null
          Oid: string
          OptimisticLockField: number | null
          ReadState: number | null
          TypePermissionObject: string | null
          WriteState: number | null
        }
        Insert: {
          Criteria?: string | null
          DeleteState?: number | null
          GCRecord?: number | null
          NavigateState?: number | null
          Oid: string
          OptimisticLockField?: number | null
          ReadState?: number | null
          TypePermissionObject?: string | null
          WriteState?: number | null
        }
        Update: {
          Criteria?: string | null
          DeleteState?: number | null
          GCRecord?: number | null
          NavigateState?: number | null
          Oid?: string
          OptimisticLockField?: number | null
          ReadState?: number | null
          TypePermissionObject?: string | null
          WriteState?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyObjectPermissionsObject_TypePermissionObject"
            columns: ["TypePermissionObject"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyTypePermissionsObject"
            referencedColumns: ["Oid"]
          },
        ]
      }
      PermissionPolicyRole: {
        Row: {
          CanEditModel: boolean | null
          GCRecord: number | null
          IsAdministrative: boolean | null
          Name: string | null
          ObjectType: number | null
          Oid: string
          OptimisticLockField: number | null
          PermissionPolicy: number | null
        }
        Insert: {
          CanEditModel?: boolean | null
          GCRecord?: number | null
          IsAdministrative?: boolean | null
          Name?: string | null
          ObjectType?: number | null
          Oid: string
          OptimisticLockField?: number | null
          PermissionPolicy?: number | null
        }
        Update: {
          CanEditModel?: boolean | null
          GCRecord?: number | null
          IsAdministrative?: boolean | null
          Name?: string | null
          ObjectType?: number | null
          Oid?: string
          OptimisticLockField?: number | null
          PermissionPolicy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyRole_ObjectType"
            columns: ["ObjectType"]
            isOneToOne: false
            referencedRelation: "XPObjectType"
            referencedColumns: ["OID"]
          },
        ]
      }
      PermissionPolicyTypePermissionsObject: {
        Row: {
          CreateState: number | null
          DeleteState: number | null
          GCRecord: number | null
          NavigateState: number | null
          Oid: string
          OptimisticLockField: number | null
          ReadState: number | null
          Role: string | null
          TargetType: string | null
          WriteState: number | null
        }
        Insert: {
          CreateState?: number | null
          DeleteState?: number | null
          GCRecord?: number | null
          NavigateState?: number | null
          Oid: string
          OptimisticLockField?: number | null
          ReadState?: number | null
          Role?: string | null
          TargetType?: string | null
          WriteState?: number | null
        }
        Update: {
          CreateState?: number | null
          DeleteState?: number | null
          GCRecord?: number | null
          NavigateState?: number | null
          Oid?: string
          OptimisticLockField?: number | null
          ReadState?: number | null
          Role?: string | null
          TargetType?: string | null
          WriteState?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyTypePermissionsObject_Role"
            columns: ["Role"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyRole"
            referencedColumns: ["Oid"]
          },
        ]
      }
      PermissionPolicyUser: {
        Row: {
          AccessFailedCount: number | null
          ChangePasswordOnFirstLogon: boolean | null
          GCRecord: number | null
          IsActive: boolean | null
          LockoutEnd: string | null
          ObjectType: number | null
          Oid: string
          OptimisticLockField: number | null
          StoredPassword: string | null
          UserName: string | null
        }
        Insert: {
          AccessFailedCount?: number | null
          ChangePasswordOnFirstLogon?: boolean | null
          GCRecord?: number | null
          IsActive?: boolean | null
          LockoutEnd?: string | null
          ObjectType?: number | null
          Oid: string
          OptimisticLockField?: number | null
          StoredPassword?: string | null
          UserName?: string | null
        }
        Update: {
          AccessFailedCount?: number | null
          ChangePasswordOnFirstLogon?: boolean | null
          GCRecord?: number | null
          IsActive?: boolean | null
          LockoutEnd?: string | null
          ObjectType?: number | null
          Oid?: string
          OptimisticLockField?: number | null
          StoredPassword?: string | null
          UserName?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyUser_ObjectType"
            columns: ["ObjectType"]
            isOneToOne: false
            referencedRelation: "XPObjectType"
            referencedColumns: ["OID"]
          },
        ]
      }
      PermissionPolicyUserLoginInfo: {
        Row: {
          LoginProviderName: string | null
          Oid: string
          OptimisticLockField: number | null
          ProviderUserKey: string | null
          User: string | null
        }
        Insert: {
          LoginProviderName?: string | null
          Oid: string
          OptimisticLockField?: number | null
          ProviderUserKey?: string | null
          User?: string | null
        }
        Update: {
          LoginProviderName?: string | null
          Oid?: string
          OptimisticLockField?: number | null
          ProviderUserKey?: string | null
          User?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyUserLoginInfo_User"
            columns: ["User"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyUser"
            referencedColumns: ["Oid"]
          },
        ]
      }
      PermissionPolicyUserUsers_PermissionPolicyRoleRoles: {
        Row: {
          OID: string
          OptimisticLockField: number | null
          Roles: string | null
          Users: string | null
        }
        Insert: {
          OID: string
          OptimisticLockField?: number | null
          Roles?: string | null
          Users?: string | null
        }
        Update: {
          OID?: string
          OptimisticLockField?: number | null
          Roles?: string | null
          Users?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_PermissionPolicyUserUsers_PermissionPolicyRoleRoles_Roles"
            columns: ["Roles"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyRole"
            referencedColumns: ["Oid"]
          },
          {
            foreignKeyName: "FK_PermissionPolicyUserUsers_PermissionPolicyRoleRoles_Users"
            columns: ["Users"]
            isOneToOne: false
            referencedRelation: "PermissionPolicyUser"
            referencedColumns: ["Oid"]
          },
        ]
      }
      products: {
        Row: {
          alternatives: Json | null
          alternativesb: Json | null
          article: string | null
          ban: boolean | null
          categorie: string | null
          categorieold: string | null
          created_at: string | null
          eng: string | null
          globalcategory: string | null
          hidden: boolean | null
          id: number
          marque: string | null
          marque_id: number | null
          name: string | null
          namebic: string | null
          photo_url: string | null
          prix: string | null
          user_id: string | null
        }
        Insert: {
          alternatives?: Json | null
          alternativesb?: Json | null
          article?: string | null
          ban?: boolean | null
          categorie?: string | null
          categorieold?: string | null
          created_at?: string | null
          eng?: string | null
          globalcategory?: string | null
          hidden?: boolean | null
          id?: number
          marque?: string | null
          marque_id?: number | null
          name?: string | null
          namebic?: string | null
          photo_url?: string | null
          prix?: string | null
          user_id?: string | null
        }
        Update: {
          alternatives?: Json | null
          alternativesb?: Json | null
          article?: string | null
          ban?: boolean | null
          categorie?: string | null
          categorieold?: string | null
          created_at?: string | null
          eng?: string | null
          globalcategory?: string | null
          hidden?: boolean | null
          id?: number
          marque?: string | null
          marque_id?: number | null
          name?: string | null
          namebic?: string | null
          photo_url?: string | null
          prix?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produits_marque_id_fkey"
            columns: ["marque_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      productsdddd: {
        Row: {
          alternatives: Json | null
          id: string
          name: string | null
        }
        Insert: {
          alternatives?: Json | null
          id?: string
          name?: string | null
        }
        Update: {
          alternatives?: Json | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      productssss: {
        Row: {
          alternatives: Json | null
          categorie: string | null
          id: string
          name: string | null
        }
        Insert: {
          alternatives?: Json | null
          categorie?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          alternatives?: Json | null
          categorie?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      ProduitsMarjane: {
        Row: {
          Article: string | null
          categorie: string | null
          id: number
          MarqueId: number | null
          Photo: string | null
          photoUrl: string | null
          Prix: string | null
        }
        Insert: {
          Article?: string | null
          categorie?: string | null
          id?: number
          MarqueId?: number | null
          Photo?: string | null
          photoUrl?: string | null
          Prix?: string | null
        }
        Update: {
          Article?: string | null
          categorie?: string | null
          id?: number
          MarqueId?: number | null
          Photo?: string | null
          photoUrl?: string | null
          Prix?: string | null
        }
        Relationships: []
      }
      tempo: {
        Row: {
          id: number
          nom: string | null
        }
        Insert: {
          id: number
          nom?: string | null
        }
        Update: {
          id?: number
          nom?: string | null
        }
        Relationships: []
      }
      tree: {
        Row: {
          givencategory: string | null
          globalcategory: string | null
        }
        Insert: {
          givencategory?: string | null
          globalcategory?: string | null
        }
        Update: {
          givencategory?: string | null
          globalcategory?: string | null
        }
        Relationships: []
      }
      XPObjectType: {
        Row: {
          AssemblyName: string | null
          OID: number
          TypeName: string | null
        }
        Insert: {
          AssemblyName?: string | null
          OID?: number
          TypeName?: string | null
        }
        Update: {
          AssemblyName?: string | null
          OID?: number
          TypeName?: string | null
        }
        Relationships: []
      }
      xx: {
        Row: {
          categorie: string | null
          id: number
          target: string | null
        }
        Insert: {
          categorie?: string | null
          id?: number
          target?: string | null
        }
        Update: {
          categorie?: string | null
          id?: number
          target?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compute_alternatives: {
        Args: {
          _article: string
          _categorie: string
          _prix: number
          _marque_id: number
        }
        Returns: Json
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      mots_en_commun: {
        Args: { article: string; champ2: string }
        Returns: number
      }
      search_brands: {
        Args: { p_search_term: string; p_limit?: number; p_offset?: number }
        Returns: Json
      }
      search_brands_old: {
        Args: { p_search_term: string; p_limit?: number; p_offset?: number }
        Returns: Json
      }
      search_products: {
        Args: { p_search_term: string; p_limit?: number; p_offset?: number }
        Returns: Json
      }
      search_productsMAKHDAMACH: {
        Args: { term: string; limit_results?: number; offset_results?: number }
        Returns: Json
      }
      search_productsOLD: {
        Args: { term: string }
        Returns: Json
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      strip_html_tags: {
        Args: { input: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      update_product_alternativesall: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
