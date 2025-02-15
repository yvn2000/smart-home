export const DUMMY_DATA = [

    {   
        room_id: 1, 
        room: 'Bedroom', 
        temperature: 22,
        devices: [
            {
                device_id: 1,
                name: 'Air Conditioner',
                logo: 'air-conditioner',        //logos use materialcommunityicons
                status: 'on',
                temperature: 22,
            },
            {
                device_id: 2,
                name: 'Lamp',
                logo: 'lamp-outline',
                status: 'off',
                temperature: 30,
            },
        ]
    },
    {   
        room_id: 2, 
        room: 'Living Room', 
        temperature: 28,
        devices: [
            {
                device_id: 1,
                name: 'Television',
                logo: 'television',
                status: 'off',
                temperature: 22,
            },
            {
                device_id: 2,
                name: 'Dog',
                logo: 'dog',
                status: 'on',
                temperature: 22,
            },
        ]
    },
    {   
        room_id: 3, 
        room: 'Kitchen', 
        temperature: 40,    //hot cause people are cooking
        devices: [
            {
                device_id: 1,
                name: 'Dishwasher',
                logo: 'dishwasher',
                status: 'off',
                temperature: 22,
            },
            {
                device_id: 2,
                name: 'Rice Cooker',
                logo: 'rice',
                status: 'off',
                temperature: 22,
            },
        ]
    },


]