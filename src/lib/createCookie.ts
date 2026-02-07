
import Cookies from 'js-cookie'

export const createCookie = async (token?: string) => {
    // console.log('token created: ', token)
    // Set token cookie without expiry
    if (!token) return;

    Cookies.set('userToken', token, {
        secure: true,
        sameSite: 'Strict',
        expires: 1 // days
    });
};

export const firstTimeVisitToken = () => {
    console.log('set the firsttime token')

    Cookies.set('didVisit', 'user did visit', {
        secure: true,
        sameSite: 'Strict'
    });
}

export const getFirstTimeVisitToken = () => {
    const firstTimeToken = Cookies.get('didVisit')

    if (firstTimeToken) {
        return firstTimeToken
    }
    return null;
}
// For getting token from the cookies
export const getCookie = () => {
    const Token = Cookies.get('userToken');
    // console.log("token here: ", Token);
    // If Token exists in the cookies, check with server if it's valid or expired
    if (Token) {
        return Token;
    }
    return null; // Token does not exist in cookies
};

export const removeToken = () => {
    // Remove the token 
    Cookies.remove('userToken');
    // and user  data
}

export const getToken = () => {
    return Cookies.get("userToken")
}


export const storeData = (data: any) => {
    try {
        Cookies.set('userData', JSON.stringify(data), { expires: 7, path: '/' }); // Expires in 7 days
        console.log("User data stored successfully");
    } catch (error) {
        console.error("Failed to store data:", error);
    }
}

export const storeOrgData = (data: any) => {
    try {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('BusinessID', JSON.stringify(data));
            console.log('✅ BusinessID stored successfully in sessionStorage');
        }
    } catch (error) {
        console.error('❌ Failed to store BusinessID in sessionStorage:', error);
    }
};

export const getOrgData = () => {
    try {
        if (typeof window !== 'undefined') {
            const data = sessionStorage.getItem('BusinessID');
            return data ? JSON.parse(data) : null;
        }
        return null;
    } catch (error) {
        console.error('❌ Failed to get BusinessID from sessionStorage:', error);
        return null;
    }
};

export const clearOrgData = () => {
    try {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('BusinessID');
        }
    } catch (error) {
        console.error('❌ Failed to clear BusinessID from sessionStorage:', error);
    }
};


export const removeOrgData = (): void => {
    try {
        Cookies.remove('BusinessID');
        console.log("BusinessID cookie has been removed.");
    } catch (error) {
        console.error("Failed to remove BusinessID cookie:", error);
    }
};

export const removeData = (): Promise<boolean | null> => {
    return new Promise((resolve, reject) => {
        try {
            removeToken();
            clearOrgData()
            console.log("User data removed successfully");


            resolve(true)
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to remove data:", error.message);
                resolve(true)
            } else {
                console.error("An unknown error occurred while removing data.");
                resolve(null)
            }
        }
    })

};

export const getData = (): any => {
    try {
        const data = Cookies.get('userData')
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return null;
    }
};
