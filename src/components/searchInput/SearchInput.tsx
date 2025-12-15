import { useState, useRef, type FC } from 'react';
import { ChatArticle, InputGroup, InputGroupAddon, InputGroupInput, Spinner } from '@/components';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { useGetChannelsByIds } from '@/hooks/useGetChannelsByIds';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import { ChannelForInviteDialog } from '../channelForInviteDialog/ChannelForInviteDialog';

interface SearchInputProps {
    className?: string;
}

export const SearchInput: FC<SearchInputProps> = ({ className }) => {
    const [searchText, setSearchText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: channels = [], isLoading: isChannelsLoading } = useGetChannelsByIds();
    const { users = [], isLoading: isUsersLoading } = useSearchUsers(searchText);

    const filteredChannels = searchText
        ? channels.filter((c) => c.name.toLowerCase().includes(searchText.toLowerCase()))
        : [];

    const isLoading = isUsersLoading || isChannelsLoading;
    const hasResults = users.length > 0 || filteredChannels.length > 0;

    return (
        <div
            ref={containerRef}
            className={clsx(className, 'relative border border-neutral-300 w-full p-4 rounded-2xl mt-4')}>
            <InputGroup>
                <InputGroupInput
                    placeholder="Search for users or channels..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
                <InputGroupAddon>{isLoading ? <Spinner /> : <Search />}</InputGroupAddon>
            </InputGroup>

            {isOpen && searchText && hasResults && (
                <div className="absolute top-20 left-0 z-10 w-full rounded-2xl border bg-neutral-100 p-2 grid gap-3">
                    {users.length > 0 && (
                        <div className="grid gap-2">
                            <span className="text-neutral-600 ml-2 text-sm">Users</span>
                            {users.map((user) => (
                                <div
                                    key={user.uid}
                                    className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 border cursor-pointer">
                                    <span>{user.displayName}</span>
                                    <ChannelForInviteDialog userId={user.uid} channels={channels} />
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredChannels.length > 0 && (
                        <div className="grid gap-2">
                            <span className="text-neutral-600 ml-2 text-sm">Channels</span>
                            {filteredChannels.map((channel) => (
                                <div key={channel.id} className="p-1 rounded-xl hover:bg-neutral-50 border">
                                    <ChatArticle variant="outline" data={channel} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
