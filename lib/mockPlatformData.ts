export const generateFilteredData = (period: string, plan: string, restaurantId: string) => {
    return {
        overview: {
            total_revenue: plan === 'all' ? 1250000 : plan === 'pro' ? 850000 : 400000,
            active_restaurants: restaurantId === 'all' ? 450 : 1,
            total_qr_scans: plan === 'enterprise' ? 120500 : 45500,
            total_bot_conversations: 8520
        },
        traffic_data: [
            { time: 'Lun', scans: 120, bots: 40 },
            { time: 'Mar', scans: 150, bots: 60 },
            { time: 'Mer', scans: 220, bots: 90 },
            { time: 'Jeu', scans: 180, bots: 70 },
            { time: 'Ven', scans: 450, bots: 150 },
            { time: 'Sam', scans: 600, bots: 250 },
            { time: 'Dim', scans: 550, bots: 210 },
        ],
        integrations: [
            { name: 'Odoo ERP', status: 'operational', latency: 124, uptime: '99.9%' },
            { name: 'Stripe Pay', status: 'operational', latency: 85, uptime: '100%' },
            { name: 'WhatsApp', status: 'degraded', latency: 450, uptime: '98.5%', error: 'Délai API Meta' },
        ],
        system_logs: [
            { id: '1', timestamp: '10:45:12', level: 'info', message: 'Backup automatique complété' },
            { id: '2', timestamp: '10:46:05', level: 'warning', message: 'Latence WhatsApp détectée > 400ms' },
            { id: '3', timestamp: '10:48:30', level: 'error', message: 'Échec de paiement (Stripe) - Refusé' },
            { id: '4', timestamp: '10:50:00', level: 'info', message: 'Nouveau restaurant inscrit (Starter)' }
        ]
    };
};

export type PlatformStats = ReturnType<typeof generateFilteredData>;
