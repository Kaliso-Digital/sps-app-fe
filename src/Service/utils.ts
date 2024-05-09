interface Permission {
    id: number;
    name: string;
  }
  
  export const hasPermission = (permissions: Permission[], targetPermission: string): boolean => {
    return permissions.some((permission) => permission.name === targetPermission);
  };