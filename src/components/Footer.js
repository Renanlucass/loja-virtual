import { useState, useEffect } from 'react';

function PhoneIcon() {
    return <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>;
}
function MailIcon() {
    return <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
}
function CalendarIcon() {
    return <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
}
function ClockIcon() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
}
function WhatsAppIcon() {
    return <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.078 1.757-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.413a11.815 11.815 0 00-16.83 16.83l-3.087.812.823-3.042a11.815 11.815 0 0019.094-14.6z"></path></svg>;
}

export default function Footer() {
    const [config, setConfig] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLojaAberta, setIsLojaAberta] = useState(false);

    const diasDaSemana = [
        { nome: 'Domingo', chave: 'horario_domingo' },
        { nome: 'Segunda', chave: 'horario_segunda' },
        { nome: 'Terça', chave: 'horario_terca' },
        { nome: 'Quarta', chave: 'horario_quarta' },
        { nome: 'Quinta', chave: 'horario_quinta' },
        { nome: 'Sexta', chave: 'horario_sexta' },
        { nome: 'Sábado', chave: 'horario_sabado' },
    ];

    const hojeIndex = new Date().getDay();
    const diaDeHoje = diasDaSemana[hojeIndex];

    useEffect(() => {
        const checkHorario = (horarioStr) => {
            if (!horarioStr || horarioStr.toLowerCase() === 'fechado') {
                return false;
            }
            try {
                const [startStr, endStr] = horarioStr.split(' às ');
                const [startHour, startMinute] = startStr.split(':').map(Number);
                const [endHour, endMinute] = endStr.split(':').map(Number);
                
                const now = new Date();
                const startTime = new Date();
                startTime.setHours(startHour, startMinute, 0, 0);
                
                const endTime = new Date();
                endTime.setHours(endHour, endMinute, 0, 0);

                return now >= startTime && now <= endTime;
            } catch (e) {
                console.error("Formato de horário inválido:", horarioStr);
                return false;
            }
        };

        async function fetchConfig() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Configuracoes_Gerais`);
                if (!response.ok) throw new Error(`Falha ao buscar configurações: ${response.statusText}`);
                const data = await response.json();
                setConfig(data.data);
                
                if (data.data) {
                    const horarioDeHoje = data.data[diasDaSemana[new Date().getDay()].chave];
                    setIsLojaAberta(checkHorario(horarioDeHoje));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchConfig();
    }, []);

    const horarioDeHoje = loading ? '...' : (config?.[diaDeHoje.chave] || 'Não definido');
    
    const formatPhoneNumberForLink = (phone) => {
        if (!phone) return '';
        return phone.replace(/\D/g, '');
    };

    const whatsAppNumber = formatPhoneNumberForLink(config?.telefone_contato);

    return (
        <>
            <footer className="bg-[#e6a6ba] text-gray-700">
                <div className="container mx-auto px-4 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-purple-700 mb-4">Atendimento ao cliente</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3">
                                    <a 
                                        href={`https://wa.me/55${whatsAppNumber}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-3 group"
                                    >
                                        <WhatsAppIcon />
                                        <span className="group-hover:text-purple-900 group-hover:underline">{loading ? 'Carregando...' : (config?.telefone_contato || 'Fale conosco')}</span>
                                    </a>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <MailIcon />
                                    <span>{loading ? 'Carregando...' : (config?.email_contato || 'Não definido')}</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-purple-700 mb-4">Horário de atendimento</h3>
                            <div className="flex items-center space-x-3">
                               <CalendarIcon />
                               <div>
                                   <p className="font-semibold">{diaDeHoje.nome}</p>
                                   <p className="text-sm">{horarioDeHoje}</p>
                               </div>
                            </div>
                            <button 
                                onClick={() => setModalAberto(true)}
                                className="mt-3 inline-flex items-center cursor-pointer space-x-2 text-sm font-semibold text-purple-700 border border-purple-200 rounded-full py-1 px-3 hover:bg-purple-100 hover:border-purple-300 transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                <ClockIcon />
                                <span>Ver todos os horários</span>
                            </button>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-purple-700 mb-4">Formas de pagamento</h3>
                            <p className="text-sm">Aceitamos Pix e os principais cartões.</p>
                        </div>
                    </div>
                </div>
            </footer>

            {modalAberto && (
                <div 
                    className={`fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 ${modalAberto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setModalAberto(false)}
                >
                    <div 
                        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center transform transition-all duration-300 ${modalAberto ? 'scale-100' : 'scale-95'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="text-xl font-bold text-gray-800 mb-6">Horário de funcionamento</h4>
                        <ul className="space-y-3 text-gray-600">
                            {diasDaSemana.map((dia, index) => (
                                <li key={dia.chave} className={`flex justify-between ${hojeIndex === index ? 'font-bold text-purple-700' : ''}`}>
                                    <span>{dia.nome}</span>
                                    <span>{loading ? '...' : (config?.[dia.chave] || 'Não definido')}</span>
                                </li>
                            ))}
                        </ul>
                        {isLojaAberta ? (
                            <p className="text-sm text-green-600 font-semibold mt-6">
                                ✅ Estamos abertos e prontos para te atender!
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-6">
                                A loja se encontra fora do horário de funcionamento, mas você ainda pode realizar seu pedido e atenderemos assim que reabrirmos.
                            </p>
                        )}
                        <button 
                            onClick={() => setModalAberto(false)}
                            className="mt-6 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
